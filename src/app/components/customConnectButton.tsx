import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function CustomConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openConnectModal,
        mounted,
        authenticationStatus,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        if (!ready) {
          return (
            <button
              disabled
              className="opacity-50 cursor-not-allowed px-6 py-2 rounded-md"
            >
              Loading...
            </button>
          );
        }

        if (!connected) {
          return (
            <button
              onClick={openConnectModal}
              className="px-4 py-2 text-white font-semibold border-2 cursor-pointer hover:scale-105 transform duration-200 ease-linear"
            >
              Connect Wallet
            </button>
          );
        }

        return (
          <div className="flex gap-4">
            <button
              onClick={openAccountModal}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold "
              title="Account Details"
            >
              {account.displayName}
            </button>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
