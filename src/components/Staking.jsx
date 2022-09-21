import React, {useEffect, useState} from 'react'
import "../App.css"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import logo from "../logo.png";
import {useSigner, useProvider} from 'wagmi'
import { ethers } from 'ethers';
import value from '.././value.json'
import tokenAbi from '../tokenAbi.json'
import stakingAbi from '../stakingAbi.json'
import Progress from 'react-progressbar';
import './Navbar.css';
import { GiHamburgerMenu } from "react-icons/gi";
import { NavLink } from "react-router-dom";



const Staking = () => {  

  const [isOpen, setOpen] = useState(false);
const [active, setActive] = useState("1");

  const handleClick = (event) => {
    setActive(event.target.id);
  };

    const [apy, setApy] = useState(10);
    const { data: signer, isError, isLoading } = useSigner()
    const provider = useProvider();

        const staking = new ethers.Contract(
          value.stakingAddress,
          stakingAbi,
          signer,
        )
        const token = new ethers.Contract(
          value.stakingToken,
          tokenAbi,
          signer,
        )
      //current token is DCU Testnet
      //token address - 0xC6dFc0F5D0Cdd26c1e3f169e66745488a06Cd0b7
      // busd address - 0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7

    const [poolId, setPoolId] = useState(0)
    const [poolInfo, setPoolInfo] = useState()
    const [userInfo, setUserInfo] = useState()
    const [walletAddressInfo, setWalletAddressInfo] = useState()
    const [mystakebalance, setMystakeBalance] = useState(0)
    const [amount, setAmount] = useState()
    const [myaddress, setMyaddress] = useState()
    const [locktime, setLockTime] = useState(1)
    const [unlockTime, setUnlockTime] = useState(1);
    const [emergencyfee, setEmergencyfee] = useState()
    const [poolsize, setPoolSize] = useState()
    const [maxpool, setMaxPool] = useState(0)
    const [reward, setReward] = useState()
    const [myTokenBalance, setMyTokenBalance] = useState(0)
    const [istokenapproved, settokenapproved] = useState(false)
    const [buttonactive1, setButtonactive1] = useState("activebutton")
    const [buttonactive2, setButtonactive2] = useState("")
    const [buttonactive3, setButtonactive3] = useState("")
    const [buttonactive4, setButtonactive4] = useState("")
    const [maxtoken, setMaxToken] = useState(0)
    const [maxContribution, setMaxContribution] = useState(0)
    const [claimableTokens, setClaimableTokens] = useState(0)
    const [errors, setError] = useState()

    useEffect(()=>{
      getPoolInfo() 
      refreshData(signer)

    },[signer, poolId, claimableTokens])

    function refreshData (signer) {

      if(signer){
        signer.getAddress().then((res)=>{setMyaddress(res)})
        getUserInfo()
        getUserLockTime()
        getTokenBalance()
        getWhiteListAddresses()
        checkApproved()
        getClaimableTokens()
      }
    }
    

        async function getPoolInfo (){
            try{
              let rpcUrl = value.rpcURl;
              let provider_ = new ethers.providers.JsonRpcProvider(rpcUrl);
              let stake_temp = new ethers.Contract(value.stakingAddress, stakingAbi, provider_);
              var _poolInfo = await stake_temp.poolInfo(poolId);
              console.log ("Pool Info: ", _poolInfo);
              console.log ("Emergency Fees: ", _poolInfo.emergencyFees.toString());
              const emergencywithdrawfee = await _poolInfo.emergencyFees.toString()
              const currrentpoolsize = await _poolInfo.currentPoolSize.toString()
              const maxcontribution = await _poolInfo.maxContribution.toString()
              const maxcontributionconverted = ethers.utils.formatEther(maxcontribution)
              const currrentpoolsizeConverted = Math.floor(ethers.utils.formatEther(currrentpoolsize))
              const maxpool = await _poolInfo.maxPoolSize.toString()
              const maxpoolConverted = ethers.utils.formatEther(maxpool)
              const lockDayss = await _poolInfo.lockDays.toString();
              setPoolInfo(_poolInfo);
              setEmergencyfee(emergencywithdrawfee);
              setPoolSize(currrentpoolsizeConverted);
              setLockTime(lockDayss)
              setMaxPool(maxpoolConverted)
              setMaxContribution(maxcontributionconverted)
              console.log("maxpool" + maxpoolConverted)
              console.log("current pools" + currrentpoolsizeConverted)


            }catch(err){
              console.log(err.message);
            }
          }

          async function getUserInfo (){

            try{
              let _userInfo = await staking.userInfo(poolId, signer.getAddress());
              console.log ("my stake token amount: ", ethers.utils.formatEther(_userInfo.amount.toString()));
              setMystakeBalance(ethers.utils.formatEther(_userInfo.amount.toString()));
            }catch(err){
              console.log("User error", err);
            }
          }

          async function getClaimableTokens () {
            try {
              let userAddress = await signer.getAddress();
              let _claimableTokens = await staking.claimableRewards(poolId, userAddress);
              console.log("Claimable Tokens: ", _claimableTokens.toString());
              setClaimableTokens(ethers.utils.formatUnits(_claimableTokens, 18).toString());
            }catch (error){
              console.log("Claimable error", error);
            }
          }
        
          async function getUserLockTime (){
            try{
              let userAddress = await signer.getAddress()
              let myunlocktime = await staking.getUserLockTime(poolId, userAddress);
              let _wallet = await signer.getAddress();      
              let _userInfo = await staking.userInfo( poolId, _wallet);
              let _stakedAmount = ethers.utils.formatEther(_userInfo.amount.toString());

              if (_stakedAmount == 0) {
                setUnlockTime("Not staked yet");
                return;
              }
              let _timestamp = parseInt(myunlocktime.toString())* 1000;
              let _time = new Date(_timestamp);
              console.log ("Unlock Time: ", _time);
              if (_timestamp >0) setUnlockTime(_time.toString());
              else setUnlockTime("Not staked yet");
            }catch(err){
              console.log("User error", err);
            }
          }
        
          async function getTokenBalance(){
            let userAddress = await signer.getAddress()
            const tokenbalance = await token.balanceOf(userAddress);
            const tokenbalanceConverted = ethers.utils.formatEther(tokenbalance.toString())
            console.log("My Token Balance -",ethers.utils.formatEther(tokenbalance.toString()))
            setMyTokenBalance(Math.floor(tokenbalanceConverted))
          }

          const checkApproved = async() => {
            let userAddress = await signer.getAddress()
            const isApproved = await token.allowance(userAddress, value.stakingAddress);
            const totaltokenapproved = isApproved.toString()
            if(totaltokenapproved.length > 2){
              console.log("approved", totaltokenapproved);
              settokenapproved(true)
            }
            else{
              console.log("Not Approved",totaltokenapproved);
              settokenapproved(false)

            }
          }
          
          async function getWhiteListAddresses (){
            try{   
              let userAddress = await signer.getAddress()
              let _wlInfo = await staking.whitelistedAddress( poolId, userAddress);
              console.log ("Whitelist Info: ", _wlInfo);
              setWalletAddressInfo(_wlInfo);
            }catch(err){
              console.log("User error", err);
            }
          }
        
          async function stakeTokens () {
            // if(walletAddressInfo){
              try{
                if(amount === undefined){
                  alert("Enter Amount First")
                }
                else{
                  await approve()
                  let _amount = ethers.utils.parseEther(amount.toString());
                  // console.log (_amount)
                  let tx = await staking.stakeTokens(poolId, _amount);
                  let reciept = await tx.wait();
                  console.log ("Stake Tx Receipt: ", reciept);
                  refreshData(signer)
                }              
              }catch (error) {
                console.log (error);
                try {
                  setError(error.error.data.message)
                } catch {
                  setError("Something went wrong, please try again!")
                }
              }
            // }
            // else{
            //   alert('Your Wallet Is Not Witelisted For Staking')
            // }
          }
          async function claimtoken () {
              try{
                  let tx = await staking.claimRewards(poolId);
                  let reciept = await tx.wait();
                  console.log ("ClaimToken: ", reciept);
                  refreshData(signer)
                }              
              catch (error) {
                console.log (error);
                try {
                  setError(error.error.data.message)
                } catch {
                  setError("Something went wrong, please try again!")
                }
              }
           
          }
        
          async function unstakeTokens () {
            try{
              let tx = await staking.unstakeTokens(poolId);
              let reciept = await tx.wait();
              console.log ("Unstake Tx Receipt: ", reciept);
              refreshData(signer)
            }catch (error) {
              console.log (error);
              try {
                setError(error.error.data.message)
              } catch {
                setError("Something went wrong, please try again!")
              }
            }
          }
        
          async function emergencyWithdraw () {
            try{
              const _staking = new ethers.Contract(
                value.stakingAddress,
                stakingAbi,
                signer,
              )
              
              let tx = await _staking.emergencyWithdraw(poolId);
              let reciept = await tx.wait();
              console.log ("Emergency Withdraw Tx Receipt: ", reciept);
            }catch (error) {
              console.log ("emergency withdraw error", error.error);
              try {
                setError(error.error.data.message)
              } catch {
                setError("Something went wrong, please try again!")
              }

            }
          }
        
          async function approve () {
            if(!istokenapproved){
              console.log('Not Approved')
              try{
                let _amount = ethers.utils.parseEther("10000000000000000000");
                let tx = await token.approve(value.stakingAddress, _amount);
                let reciept = await tx.wait();
                console.log ("Approve Tx Receipt: ", reciept);
              }catch (error) {
                console.log (error);
                // alert(error.data.message);
              }
            }
            else{
              console.log('already approved')
            }
            
          }
        
      
        
          function handleChange(event) {
            const { name, value } = event.target;
            if (name === "tokenAmount"){
              console.log(value)
              setAmount(value);
              setMaxToken(value)
            }
          }
        

        
  return (
    <div className="App">
      {/* <header className="navbar">
        <div className='navbar__logo'>
        <a href="#"><img src={logo} className="logo" alt="logo" style={{ height: '65px', width: '100px' }} /> </a>
        </div>
        <div className='navbar__menu'>
        
          <ConnectButton />
        </div>  
          </header> */}
      <nav className="main-nav">
      <div className="logo">
        <a target="__blank" href='https://noe-global.com/'><img src={logo} alt="img" /></a>
      </div>
      <div className={isOpen ? " mobile-menu-link" : "menu-link"}>
        {/* <div className="flex">
          <img src={logo} alt="logo" className="mobilelogo"></img>
        </div> */}
        <ul className="navbarul">
          <li>
            <a
              className={active === "1" ? "actived" : ""}
              href="#"
              id={"1"}
              onClick={handleClick}
            >
              Farming
            </a>
          </li>
          <li>
            <a
              className={active === "2" ? "actived" : ""}
              href="#"
              id={"2"}
              onClick={handleClick}
            >
              Lending
            </a>
          </li>
          <li>
            <a
              
              rel="noreferrer"
              href="#"
              className={active === "3" ? "actived" : ""}
              id={"3"}
              onClick={handleClick}
            >
              Affiliation
            </a>
          </li>
          <li>
            <a
              className={active === "4" ? "actived" : ""}
              id={"4"}
              onClick={handleClick}
              to="/"
            >
              Swap
            </a>
          </li>
          {/* <li>
            <NavLink
              className={active === "5" ? "actived" : ""}
              id={"5"}
              onClick={handleClick}
              to="/"
            >
              Market
            </NavLink>
          </li> */}
      
            {/* <button className="contact-btn">connect wallet</button> */}
            <ConnectButton className="contact-btn" sx={{ color: '#000000' }} />
        </ul>
        {/* hamburger menu code below */}
      </div>
       <div className="button">
        <div className="ham">
          <GiHamburgerMenu onClick={() => setOpen(!isOpen)} />
        </div>
      </div>
    </nav>
          <section className="staking">
            <div className="background">
              <div className="info">
                <h1 className="infoHeading">Staking</h1>
                <p className="infoPara">
                Stake your NOE and earn up to 18% APY interest with our cutting edge staking platform providing you full control over your investment.

                </p>
              </div>
            </div>
            <div className="container">
              <div className="left card">
                <div className="heading">
                  <h2>Participate in our Stake</h2>
                </div>
                <div className="days">
                  <button
                    className={`btn_primary nonactivebutton ${buttonactive1} daysbtn`}
                    style={{buttonactive1}}
                    onClick={() => {setApy(10); setPoolId(0); setButtonactive1("activebutton"); setButtonactive2(""); setButtonactive3(""); setButtonactive4("")}}>
                    BRONZE
                  </button>
                  <button className={`btn_primary nonactivebutton ${buttonactive2} daysbtn`} onClick={() => {setApy(22); setPoolId(1); setButtonactive2("activebutton"); setButtonactive1(""); setButtonactive3(""); setButtonactive4("")} }>
                  SILVER
                  </button>
                  <button className={`btn_primary nonactivebutton ${buttonactive3} daysbtn`} onClick={() =>{setApy(45); setPoolId(2); setButtonactive3("activebutton"); setButtonactive1(""); setButtonactive2(""); setButtonactive4("")}}>
                  GOLDEN
                  </button>
                  <button className={`btn_primary nonactivebutton ${buttonactive4} daysbtn`} onClick={() =>{setApy(69); setPoolId(3); setButtonactive4("activebutton"); setButtonactive1(""); setButtonactive3(""); setButtonactive2("")}}>
                  PLATINUM
                  </button>
                </div>
                <Progress color="#339CEE" completed={(parseFloat(poolsize)* 100)/parseFloat(maxpool)} height={30} data-label={`${(parseFloat(poolsize)* 100)/parseFloat(maxpool)}% Pool Filled`} />

                  {errors ? <div className='showerror'>{errors}</div>:<></>}

                <div className="bal-info">
                  <div className="bal-left">

                    <div>
                      My Balance : <span> {myTokenBalance}</span> <br />
                    </div>
                    <div>
                    Total Tokens Locked : <span>{poolsize} NOE</span>
                      <br />
                    </div>
                    <div>
                      Max Contribution: <span>{maxContribution} NOE</span>
                    </div>
                    <div>
                      Max PoolSize: <span>{maxpool} NOE</span>
                    </div>
                    
                    <div>
                      Lock Deadline : <span>{locktime} Days</span> <br />
                    </div>
                    {/* <div>
                      Max Contribution : <span>{maxContribution}</span> <br />
                    </div> */}
                    <div>
                      Unstake fee: <span>{emergencyfee/10}%</span>
                    </div>
                  
                  </div>
                  <div className="bal-right">
                    <span id="apy">APY</span>
                    {apy}% <br />
                  </div>
                </div>
                <hr />
                <div className="user-input">
                  <div className="input1">
                    <input type="number" className="tokeninput" name="tokenAmount" value={maxtoken} placeholder="0.00" onChange={(e) => handleChange(e)}/>
                    <button className="btn_primary max" onClick={(e) => setMaxToken(myTokenBalance)}>Max</button>
                  </div>
                  <div className="btn">
                    <button className="btn_primary" onClick={stakeTokens}>Stake</button>
                    <button className="btn_primary" onClick={unstakeTokens}>Unstake</button>
                    <button className="btn_primary"onClick={emergencyWithdraw}>Withdraw</button>
                  </div>
                </div>
              </div>
              <div className="right card">
                <div className="rightinner">
                  <p className="big">{(mystakebalance)?mystakebalance:0.00} NOE</p>
                  <p>My Total Token Locked</p>
                </div>
                <hr />
                <div className="rightinner">
                  <p className="big">{parseFloat(claimableTokens).toFixed(2)} TToken</p>
                  {/* <p className='big'>200%</p>
                  <p>APY</p> */}
                  <button onClick={claimtoken} className="claimtoken">Claim Tokens</button>
                </div>
                <hr />
                <div className="rightinner">
                  <p className="big">{unlockTime}</p>
                  <p>Unlock Time</p>
                </div>
              </div>
            </div>
          </section>
        </div>
  )
}

export default Staking