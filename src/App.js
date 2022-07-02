import { useState } from "react";
import { ConnectButton, Loading } from "web3uikit";
import toast, { Toaster } from "react-hot-toast";
import abi from "./contracts/Donate.json";
import { ethers } from "ethers";

function App() {
  // Contract Address & ABI
  const contractAddress = "0x4385B18589eaFcA91A5E396baFA98db0e8a4aEA7";
  const contractABI = abi.abi;

  const [amount, setAmount] = useState("");
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [transactionFailure, setTransactionFailure] = useState(false);

  const onInvalidNotification = () =>
    toast.error("Please, enter a valid amount to donate", {
      duration: 5000,
    });

  const handleInvalidAmount = () => {
    onInvalidNotification();
  };

  const onSomethingWentWrong = () =>
    toast.error("Transaction failed!", {
      duration: 5000,
    });
  const somethingWentWrong = () => {
    onSomethingWentWrong();
  };

  const onSuccessNotification = () =>
    toast.success("Donation recieved successfully.", {
      duration: 9000,
    });

  const thankYouMessage = () =>
    toast.success("Thank you for donating to web3bridge", {
      duration: 9000,
      icon: "👏",
    });

  const transactionSuccessfulNotification = () => {
    onSuccessNotification();
    setTimeout(() => thankYouMessage(), 9000);
    setTimeout(() => window.location.reload(), 11000);
  };

  const onNotLogin = () =>
    toast.error("Please, connect with metamask to continue", {
      duration: 5000,
    });

  const handleNotLogin = () => {
    onNotLogin();
  };

  const handleDonate = async () => {
    if (
      !localStorage.getItem(
        "Parse/QDDcI1iLWsVuTLvFfHyng911stwshWsLM68iZQoJ/currentUser"
      )
    ) {
      handleNotLogin();
    } else if (
      localStorage.getItem(
        "Parse/QDDcI1iLWsVuTLvFfHyng911stwshWsLM68iZQoJ/currentUser"
      ) &&
      Number(amount) <= 0
    ) {
      handleInvalidAmount();
    } else {
      try {
        setTransactionSuccess(true);
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum, "any");
          const signer = provider.getSigner();
          const donate = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );

          console.log("Donating some MATIC...");
          const transactionReceipt = await donate.depositMatic({
            value: ethers.utils.parseEther(amount),
          });

          console.log("Transaction", transactionReceipt);

          const transactionResult = await transactionReceipt.wait();

          console.log(
            "Donation successful: transaction result",
            transactionResult
          );
          transactionReceipt && setTransactionSuccess(false);
          transactionReceipt && transactionSuccessfulNotification();

          // Clear the form fields.
        }
      } catch (err) {
        console.log("something went wrong", err);
        setTransactionFailure(true);
        !transactionFailure && somethingWentWrong();
        setTransactionSuccess(false);
      }
    }

    setAmount("");
  };

  return (
    <>
      <header>
        <img src="/fren.png" alt="logo" />
        <div className="right-section">
          <ul>
            <li>
              <ConnectButton />
            </li>
          </ul>
        </div>
      </header>

      <div className="intro">
        <h1>Giving it back to where we have all started.</h1>
        <p>
          Web3bridge has been a blessing for all of us. <br />
          It's time we give back to where we have all have started.
        </p>
      </div>

      <div className="input">
        <input
          type="number"
          value={amount}
          placeholder="Enter some MATIC to donate"
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />

        <button
          onClick={handleDonate}
          disabled={transactionSuccess}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {transactionSuccess ? (
            <Loading size={20} spinnerColor="#fff" />
          ) : (
            "Donate"
          )}
        </button>
        <Toaster />
      </div>

      <footer>© Handcrafted from scratch with 💖 by devlongs.</footer>
    </>
  );
}

export default App;
