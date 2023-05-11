import { ethers } from "./ethers-5.1.esm.min.js";
import { abi, contractAddress } from "./constants.js";
const connectBtn = document.getElementById("connectbtn");
const fundBtn = document.getElementById("fundtbtn");
const getBalanceBtn = document.getElementById("getbalancebtn");
const withdrawBtn = document.getElementById("withdrawbtn");

//? connect button function
const connect = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    connectBtn.innerHTML = "Connected";
  } else {
    connectBtn.innerHTML = "Please install MetaMask";
  }
};
connectBtn.onclick = connect;

//? get balance button function
const getBalance = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(contractAddress);
      console.log(ethers.utils.formatEther(balance));
    } catch (error) {
      console.log(error);
    }
  } else {
    getBalanceBtn.innerHTML = "Please install MetaMask";
  }
};
getBalanceBtn.onclick = getBalance;

//? Fund button function
const fund = async () => {
  const ethAmount = document.getElementById("ethammount").value;
  console.log(`Funding with ${ethAmount}....`);
  if (typeof window.ethereum !== "undefined") {
    //*Provider / connection to the blockchain
    //*Signer / Wallet / someone with some gas
    //*Contratct / that we will interact with
    //*abi / address
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMine(transactionResponse, provider);
      console.log("Done");
    } catch (error) {
      console.log(error);
    }
  } else {
    fundBtn.innerHTML = "Please install MetaMask";
  }
};
fundBtn.onclick = fund;

//? withdraw button function
const withdraw = async () => {
  console.log(`Withdrawing......`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  } else {
    withdrawBtn.innerHTML = "Please install MetaMask";
  }
};
withdrawBtn.onclick = withdraw;

//? Listen for transaction mine function
const listenForTransactionMine = (transactionResponse, provider) => {
  console.log(`Minning ${transactionResponse.hash}...`);
  //* Listen for transaction to finish
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
};
