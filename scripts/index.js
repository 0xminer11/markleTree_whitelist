const Web3 = require('web3');
var express = require("express");
var app = express();
const keccak256 = require("keccak256")
const { MerkleTree } = require("merkletreejs");
const { use } = require('express/lib/application');
const {abi} = require('./whitelist.json')
require('dotenv').config();
const { ethers } = ("ethers");

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

var whitelistedUsers=[];
console.log("Initial list :",whitelistedUsers );



// const web3 = new Web3(new Web3.providers.HttpProvider(process.env.MUMBAI_URL));

// const signer = new ethers.Wallet(process.env.PRIVATE_KEY, web3)
// let contract = new web3.eth.Contract(abi,process.env.CONTRACT_ADDRESS,signer);
// console.log("web",contract);
async function getcontract(){

    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.MUMBAI_URL));
    // console.log("web",web3);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, web3)
    console.log(signer);
    let contract = new web3.eth.Contract(abi,process.env.CONTRACT_ADDRESS,signer);
    console.log("contract done-------------------------------",contract);
    return contract;
}



async function addTowhitelist(user){
    console.log("ading",user);
    whitelistedUsers.push(user);
    console.log("wh",whitelistedUsers);
    const leafNodes = whitelistedUsers.map((item) => keccak256(item))
    const tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
    const root = tree.getHexRoot()
    const contract = await getcontract()

    const Tx= await contract.setrootHash(root);
}


async function removeFromwhitelist(user){

    const index = whitelistedUsers.indexOf(user)
    whitelistedUsers.splice(index,1)
    const leafNodes = whitelistedUsers.map((item) => keccak256(item))
    const tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
    const root = tree.getHexRoot()
    const contract = await getcontract()
    const Tx = await contract.setrootHash(root);
    return Tx.hash;
}


async function veryfyUser(user){
    const leafnodes = whitelistedUsers.map((item) => keccak256(item))
    const tree = new MerkleTree(leafnodes, keccak256, { sortPairs: true })
    const root = tree.getHexRoot()
    let user_hex = get_user_hex_hash(tree, user)
    const data_proof = datatree.getHexProof(user_hex)
    const contract =getcontract()
    const Tx = await contract.verify(data_proof,user_hex)
    return (Tx)
}


function get_user_hex_hash(tree, user) {
    let index = whitelistedUsers.indexOf(user);
    if (index === -1) {
        console.log("user not found");
    }
    return tree.getHexLeaves()[index];
}


app.get("/addToWhitelist", async (req, res) => {
    // console.log("req",req);
    try{
        console.log("comming");
        var data = await addTowhitelist(req.param("user"))
        res.send({msg:"User Added To Whitelist.....",TxHash: data})
    }catch{
        res.send({msg:"Failed to add"})
    }
});


app.get("/removeFromWhitelist", async (req, res) => {
    try{
        var data = await removeFromwhitelist(req.param("user"))
        res.send({msg:"User removed from Whitelist.....",TxHash:data})
    }catch{
        res.send({msg:"Failed to remove from Whitelist....."})
    }

});


app.get("/verifyUser", async (req, res, next) => {
    try{
        var data = await veryfyUser(req.param("user"))
        res.send({msg:"user is"})
    }catch{
        res.send({msg:"Failed to remove from Whitelist....."})
    }

});