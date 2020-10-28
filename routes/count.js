const express = require('express');
const router = express.Router();
const models = require('../models');

const ELECTED = 'elected';
const EXCLUDED = 'excluded';

/* Count ballots. */
router.get('/', async function (req, res, next) {
    //get data
    let ballots = await models.ballot.findAll();
    let candidates = await models.candidate.findAll();
    let parties = await models.party.findAll();
    let voteName;
    let positionLeft = 6;
    let orderElected = 1;

    //initial

    // ballot id[key] : ballot preferences[value]
    let ballotsMap = new Map();
    ballots.forEach(ballot =>{
        ballotsMap.set(ballot.dataValues.id, JSON.parse(ballot.dataValues.preferences));
    })

    // candidateId[key] : ballot ids[value]
    let votes = new Map();
    candidates.forEach(value => {
        votes.set(value.dataValues.id.toString(), []);
    });

    // candidate id[key] : candidate object[value]
    let candidatesMap = new Map();
    candidates.forEach(candidate =>{
        let candidateObj = candidate.dataValues;
        candidateObj['order_elected'] = 0;
        candidatesMap.set(candidate.dataValues.id.toString(),candidateObj);
    })

    // party vote name[key] : candidate ids[value]
    let votePartyName = new Map();
    parties.forEach(party => {
        votePartyName.set(party.dataValues.voteName, []);
    });
    candidates.forEach(candidate => {
        let partyName = candidate.dataValues.party;
        parties.forEach(party => {
            if (party.dataValues.partyName === partyName)
                voteName = party.dataValues.voteName;
        })

        votePartyName.get(voteName).push(candidate.dataValues.id);
    })

    //calculate quota
    let ballotsCount = ballots.length;
    let candidatesCount = candidates.length;
    let quota = Math.floor(ballotsCount / (candidatesCount + 1)) + 1;


    //count ballots
    let electedListThisCount = [];
    let leastBallotCandidateId = -1;
    let leastBallotCandidateBallots = Number.MAX_VALUE;
    //first preferences
    ballots.forEach(ballot => {
        let curCandidateId = -1;

        //above, get current candidate id to be voted
        if (ballot.type === 'above') {
            let preferences = JSON.parse(ballot.preferences);
            votePartyName.get(preferences['1']).every(candidateId => {
                let candidate = candidatesMap.get(candidateId.toString());
                curCandidateId = candidate.id;
            });
        }

        //below, get current candidate id to be voted
        if (ballot.type === 'below') {
            let preferences = JSON.parse(ballot.preferences);
            curCandidateId = preferences['1'];
        }

        curCandidateId = curCandidateId.toString();
        //vote to the candidate
        votes.get(curCandidateId).push(ballot.id);

        //elected
        let vote = votes.get(curCandidateId);
        if(vote.length>=quota && electedListThisCount.indexOf(curCandidateId)===-1) {
            electedListThisCount.push(curCandidateId);
        }

        //is least ballots candidate
        if(vote.length<leastBallotCandidateBallots){
            leastBallotCandidateId=curCandidateId;
            leastBallotCandidateBallots = vote.length;
        }
    });

    while(positionLeft != 0){
        let curCandidateId;
        if(electedListThisCount.length!=0){
            //elected
            positionLeft--;
            curCandidateId = electedListThisCount[0];
            candidatesMap.get(curCandidateId).status = ELECTED;
            candidatesMap.get(curCandidateId).order_elected = orderElected++;
            electedListThisCount.splice(0,1);
        }
        else{
            //excluded
            curCandidateId = leastBallotCandidateId;
            candidatesMap.get(leastBallotCandidateId).status = EXCLUDED;
        }

        //transfer
        let voteCount = votes.get(curCandidateId).length;
        let transferList = [];
        if(voteCount >quota ){
            //elected transfer
            while(voteCount != quota){
                transferList.push(votes.get(curCandidateId).pop());
                voteCount = votes.get(curCandidateId).length;
            }

        } else if(votes<quota){
            //excluded transfer
            transferList = votes.get(curCandidateId);
        }
        transferList.forEach(ballot=>{
            for(let candidateId in ballotsMap.get(ballot)){
                let candidate = candidatesMap.get(candidateId);
                if(candidate.status !== ELECTED && candidate.status!==EXCLUDED){
                    let curCandidateId = candidate.id.toString();
                    votes.get(curCandidateId).push(ballot);
                    if(votes.get(curCandidateId).length>=quota && electedListThisCount.indexOf(curCandidateId)===-1){
                        electedListThisCount.push(curCandidateId);
                    }
                    break;
                }
            }
        });
    }

    let electedList = [];
    candidatesMap.forEach(candidate=>{
        if(candidate.status===ELECTED) {
            delete candidate.id;
            candidate.senator = candidate.name;
            delete candidate.name;
            electedList.push(candidate);
        }
    })
    console.log(electedList);

    // insert into database
    try {
        let dataRes = await models.result.bulkCreate(electedList);
    } catch (err) {
        console.log(err);
        // failed to insert into database
        // could be database connection error or input not correct
        res.json({status: "error", msg: "database connection error"});
        return;
    }

    // insert success
    res.json({status: "count success"});
});


module.exports = router;

