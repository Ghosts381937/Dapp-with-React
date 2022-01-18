import { useEffect, useState } from 'react';
import Web3 from 'web3';
import {CONTACT_ADDRESS, CONTACT_ABI} from './config';

function App() {
  const [account, setAccount] = useState(); // state variable to set account.
  const [web3, setWeb3] = useState();
  const [contract, setContract] = useState();
  const [totalSupply, setTotalSupply] = useState();
  const [chainId, setChainId] = useState();
  const [GHOBalance, setGHOBalance] = useState();

  //connect to metamask wallet and get current selected account.
  const connectWallet = () => {
    window.ethereum.request({ method: 'eth_requestAccounts' })
    .then((_account) => {setAccount(_account[0]);console.log(_account);});
  }

  //using the contract to transfer the currency with the metamask. 
  const handleTranfer = () => {
    contract.methods.transfer({_to}, web3.utils.toWei('1', 'ether'))
    .send({from: account});
  }

  //using the contract to approve the currency with the metamask. 
  const handleApprove = () => {
    contract.methods.approve(account, web3.utils.toWei('1', 'ether'))
    .send({from: account});
  }
  
  useEffect(() => {
    async function init() {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61' }],
      });
      const _web3 = new Web3(window.ethereum);
      const _account = await _web3.eth.getAccounts();
      const _chainId = await _web3.eth.net.getId();
      const _contract = new _web3.eth.Contract(CONTACT_ABI, CONTACT_ADDRESS);
      const _totalSupply = await _contract.methods.totalSupply().call();
      const _balance = await _contract.methods.balanceOf(_account[0]).call();
      setWeb3(_web3);
      setAccount(_account[0]);
      setChainId(_chainId);
      setContract(_contract);
      setTotalSupply(_web3.utils.fromWei(_totalSupply, 'ether'));
      setGHOBalance(_web3.utils.fromWei(_balance, 'ether'));
    }
    init();
   }, [web3]);
    return (
      <div>
        Your account is: {account}
        <br />
        TotalSupply is: {totalSupply}
        <br />
        ChainId is: {chainId}
        <br />
        GHO is: {GHOBalance}
        <br />
        <button onClick={connectWallet}>Connect Wallet</button>
        <br />
        <button onClick={handleTranfer}>Transfer</button>
        <br />
        <button onClick={handleApprove}>Approve</button>
      </div>
    );
}

export default App;