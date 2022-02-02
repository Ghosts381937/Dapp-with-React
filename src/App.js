import { useEffect, useState } from 'react';
import Web3 from 'web3';
import {CONTACT_ADDRESS, CONTACT_ABI} from './config';

function App() {
  const [numbers, setNumbers] = useState(); // state variable to set account.
  const [account, setAccount] = useState();
  const [value, setValue] = useState();
  const [index, setIndex] = useState();
  const [web3, setWeb3] = useState();
  const [contract, setContract] = useState();

  //connect to metamask wallet and get current selected account.
  const handleCreate = () => {
    console.log(account);
    contract.methods.create(value).send({from:account})
    .then(() => alert('success'))
    .catch((response) => alert(response));
  }
  
  //using the contract to transfer the currency with the metamask. 
  const handleUpdate = () => {
    contract.methods.update(index, value).send({from:account})
    .then(() => alert('success'))
    .catch((response) => alert(response));
  }

  //using the contract to approve the currency with the metamask. 
  const handleDelete = () => {
    contract.methods.mydelete(index).send({from:account})
    .then(() => alert('success'))
    .catch((response) => alert(response));
  }

  const handleConnectWallet = () => {
    window.ethereum.request({ method: 'eth_requestAccounts' })
    .then((_account) => {setAccount(_account[0])});
  }
  
  useEffect(() => {
    async function init() {
      /*await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61' }],
      });*/
      const _web3 = new Web3(window.ethereum);
      const _account = await _web3.eth.getAccounts();
      const _contract = new _web3.eth.Contract(CONTACT_ABI, CONTACT_ADDRESS);
      const _numbers = await _contract.methods.read().call();
      setWeb3(_web3);
      setAccount(_account[0])
      setContract(_contract);
      setNumbers(_numbers);
    }
    init();
   }, [web3]);
    return (
      <div>
        <button onClick={handleConnectWallet}>Connect Wallet</button>
        <br />
        Account address: {account && account}
        <div>Numbers:{numbers && numbers.map((number) => <div>{number}</div>)}</div>
        <form onSubmit={(e) => {handleCreate();e.preventDefault();}}>
            <label>value</label>
            <input onChange={(e) => setValue(e.target.value)} />
          <button type='submit'>Create</button>
        </form>
        <form onSubmit={(e) => {handleUpdate();e.preventDefault();}}>
            <label>index</label>
            <input onChange={(e) => setIndex(e.target.value)} />
            <label>value</label>
            <input onChange={(e) => setValue(e.target.value)} />
          <button type='submit'>Update</button>
        </form>
        <form onSubmit={(e) => {handleDelete();e.preventDefault();}}>
          <label>index</label>
          <input onChange={(e) => setIndex(e.target.value)} />
          <button type='submit'>Delete</button>
        </form>
      </div>
    );
}

export default App;