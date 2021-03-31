import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

import web3 from './web3';
import lottery from './lottery';

function App() {
    const [manager, setManager] = useState('');
    const [players, setPlayers] = useState('');
    const [balance, setBalance] = useState('');
    const [value, setValue] = useState('');
    const [message, setMessage] = useState('');

    useEffect(async () => {
        setManager(await lottery.methods.manager().call());
        setPlayers(await lottery.methods.getPlayers().call());
        setBalance(await web3.eth.getBalance(lottery.options.address));
    }, []);

    async function onSubmit(e) {
        e.preventDefault();

        // This is needed to allow this application to interact with metamask
        window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        setMessage('Waiting on transaction success...');

        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei(value, 'ether'),
        });
        setMessage('You have been entered!');
    }

    async function onClick(e) {
        // This is needed to allow this application to interact with metamask
        window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        setMessage('Waiting on transaction success...');

        await lottery.methods.pickWinner().send({
            from: accounts[0],
        });

        const winner = await lottery.methods.lastwinner().call();
        setMessage(`${winner} has won!`);
    }

    return (
        <div>
            <h2> Lottery Contract</h2>
            <p>
                This contract is managed by: {manager} <br />
                There are currently {players.length} people entered, competing
                to win {web3.utils.fromWei(balance)}
            </p>
            <hr />

            <form onSubmit={onSubmit}>
                <h4> Want to try your luck? </h4>
                <div>
                    <label>Amount of ether to enter</label>
                    <input
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                    />
                </div>
                <button>Enter</button>
            </form>
            <hr />

            <h4>Ready to pick a winner?</h4>
            <button onClick={onClick}>Pick a winner!</button>

            <hr />

            <h1>{message}</h1>
        </div>
    );
}

export default App;
