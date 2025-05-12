/*
  meta {
    "title": "How To Realize A Simple Collateralized Stablecoin Protocol",
    "description": "This article will introduce how to realize a simple collateralized stablecoin protocol on Ethereum.",
    "date": "2025-04-20",   
    "tags": ["Stablecoin", "Collateralized Stablecoin", "Stablecoin Protocol", "Ethereum"],
    "slug": "how-to-realize-simple-collateralized-stablecoin-protocol"
  }
*/
"use client"
import BlogPost from '@/app/components/BlogPost';
import { CodeBlock } from 'react-code-block';
import Mermaid from '@/app/components/Mermaid';
import {
    zetaCoinCode,
    vaultParamsCode,
    depositCode,
    borrowCode,
    liquidateCode,
    oracleCode,
    mermaidChart1,
    mermaidChart2,
    repayCode,
    withdrawCode,
    deployCode,
    deloyCommand,
    deployOutput,
    testCode
} from './codeBlocks';

export default function BlogPostPage() {
    return (
        <>
            <BlogPost>
                <h1>How To Realize A Simple Collateralized Stablecoin Protocol</h1>

                <h2>1. Introduction</h2>
                <p>Collateralized stablecoins are a fundamental building block of DeFi, providing price stability through overcollateralization. This article will guide you through creating a simple yet robust collateralized stablecoin protocol on Ethereum.</p>
                <h2>2. What is collateralized stablecoin? and why is it stable?</h2>
                <p>
                    Collateralized stablecoins are a type of stablecoin that are collateralized by a specific asset. The most common collateral asset is USDC, USDT, ETH, etc.
                    The price of the stablecoin is pegged to the price of the collateral asset, so that the stablecoin is stable. To make it stable, we should design a incentives mechanism to make it most
                    profitable to keep the price stable.
                </p>
                <p>
                    For example, if we want to make the stablecoin price stable at 1 USD, we should let the borrowable amount of stablecoin is less than the collateral's total price in USD,
                    . And if the price of the stablecoin is too high and you want to repay the debt to withdraw the collateral, you will not do this,
                    because you need to pay the premium of stablecoin to repay the debt, that's not profitable, since this kind of requirement is few,
                    so the price of the stablecoin will less likely to be higher than 1 USD.
                </p>
                <p>Conversely, when the price drops below the peg, the Liquidation mechanism comes into play.
                    If a user's collateral value falls below a pre - set threshold due to price fluctuations,
                    their collateral will be able to be liquidated by the liquidation mechanism.
                    To further enhance the effectiveness of the stability - maintaining mechanism,
                    we will add a panelty to who are lack of collateral and cause the price drop,
                    individuals who take the initiative to liquidate their debts can be rewarded with a portion of the penalties
                    . This not only encourages debtors to act promptly to avoid more serious consequences
                    but also distributes the burden of maintaining market stability more fairly among participants.
                </p>
                <h2>2. Prerequisites</h2>
                <h3>Development Environment Setup</h3>
                <ul>
                    <li>Node.js and npm installation, this is for installing truffle and developing dapp</li>
                    <li>Solidity compiler setup, so that you can compile the solidity code</li>
                    <li>Install Truffle development framework which can reduce the difficulty of developing and deploying smart contracts, and also provide a local network for testing</li>
                    <li>MetaMask wallet configuration, this is for deploying the contract and interacting with the contract</li>
                    <li>Sepolia, an official testnet of Ethereum, is used for testing</li>
                </ul>

                <h2>3. Core Protocol Design</h2>
                <h3>What should we consider when designing the protocol?</h3>
                <p>Before we start to implement the protocol, we need to design the architecture of the protocol,
                    and our goal is to make it more robust, scalable, and secure, and also easy to understand and maintain, and
                    obviously, to handle the price fluctuation of the collateral to make the stablecoin at a stable price.
                </p>
                <p>
                    To address these questions, we need to design the architecture of the protocol, first of all,
                    we need to choose which protocol to be used by our stablecoin, here I choose ERC20 as the protocol of the stablecoin, because it is the most common protocol with mature tools and libraries.
                    And as which coin to be used as the collateral, common collaterals are USDC, USDT, ETH, NFTs, etc., since we want to make it simple and it's on the ethereum network, so I choose ETH as the collateral.
                    So that we need a vault contract to manage the collateral, and we need to get the price of the collateral, so we also need an orable contract and for the price feed,
                    I choose ChainLink, because it's widely used and relatively reliable.
                    And the most important part, there should be a liquidatation mechanism, which can deal the debt when price changes and maintain the token price stable.
                </p>

                <p>The following are the core components of the protocol:</p>
                <ul>
                    <li>ERC20 Token Contract</li>
                    <li>Vault Contract (collateral management)</li>
                    <li>Price Oracle Integration</li>
                    <li>Liquidation Mechanism</li>
                </ul>

                <p>
                    After we have an rough architecture of it, we should dive deeper into the details of the protocol.
                    There will be at last 5 methods vault should expose to the outside:
                </p>
                <ul>
                    <li>deposit</li>
                    <li>withdraw</li>
                    <li>borrow</li>
                    <li>repay</li>
                    <li>liquidate</li>
                </ul>
                <p>
                    And the token contract should provide at least mint and burn, oracle contract should at least provide a method to get the price change.
                </p>
                <p>
                    According above we can get the following diagram shows the architecture of the protocol:
                </p>
                <Mermaid
                    id="protocol-architecture"
                    chart={mermaidChart1}
                />
                <p>
                    and the following diagram shows the process of collateralization:
                </p>
                <Mermaid
                    id="collateralization-process"
                    chart={mermaidChart2}
                />
                <p>
                    For further details, I will introduce with the implementation details of the protocol in the following sections.
                </p>
                <h2>4. Smart Contract Development</h2>
                <p>Let's dive into the core implementation of our stablecoin protocol. We'll examine each component in detail:</p>

                <h3>4.1 Stablecoin Token (ZetaCoin)</h3>
                <p>Our stablecoin is implemented as an ERC20 token with minting and burning controlled by the vault:</p>
                <CodeBlock
                    code={zetaCoinCode}
                    language="js"
                >
                    <CodeBlock.Code className="bg-black">
                        <CodeBlock.LineContent>
                            <CodeBlock.Token />
                        </CodeBlock.LineContent>
                    </CodeBlock.Code>
                </CodeBlock>

                <h3>4.2 Vault Contract Structure</h3>
                <p>The vault manages collateral positions and defines key risk parameters:</p>
                <CodeBlock
                    code={vaultParamsCode}
                    language="js"
                >
                    <CodeBlock.Code className="bg-black">
                        <CodeBlock.LineContent>
                            <CodeBlock.Token />
                        </CodeBlock.LineContent>
                    </CodeBlock.Code>
                </CodeBlock>

                <h3>4.3 Core Operations</h3>
                <p>Users can deposit ETH as collateral and this will increase the total collateral amount:</p>
                <CodeBlock
                    code={depositCode}
                    language="js"
                >
                    <CodeBlock.Code className="bg-black">
                        <CodeBlock.LineContent>
                            <CodeBlock.Token />
                        </CodeBlock.LineContent>
                    </CodeBlock.Code>
                </CodeBlock>

                <p>And borrow stablecoins against their collateral, this will increase the total debt amount:</p>
                <CodeBlock
                    code={borrowCode}
                    language="js"
                >
                    <CodeBlock.Code className="bg-black">
                        <CodeBlock.LineContent>
                            <CodeBlock.Token />
                        </CodeBlock.LineContent>
                    </CodeBlock.Code>
                </CodeBlock>
                <p>User can withdraw the collateral as long as the debt is still within collateral ratio:</p>
                <CodeBlock
                    code={withdrawCode}
                    language="js"
                >
                    <CodeBlock.Code className="bg-black">
                        <CodeBlock.LineContent>
                            <CodeBlock.Token />
                        </CodeBlock.LineContent>
                    </CodeBlock.Code>
                </CodeBlock>
                <p>User can also repay the debt, this will decrease the total debt amount:</p>
                <CodeBlock
                    code={repayCode}
                    language="js"
                >
                    <CodeBlock.Code className="bg-black">
                        <CodeBlock.LineContent>
                            <CodeBlock.Token />
                        </CodeBlock.LineContent>
                    </CodeBlock.Code>
                </CodeBlock>
                <h3>4.4 Liquidation Mechanism</h3>
                <p>
                    This is the most important part of the protocol, it will liquidate the position when the debt is too high,
                    first of all, it will check if the position is liquidatable, if so, it should calculate the penalty and max repayable debt,
                    then burn the stablecoin transformed from the liquidator and transfer the collateral to the liquidator
                    (plus the penalty as reward, which will encourage more liquidation to make debt/collateral ratio within the safe range).
                    Sometimes the collateral is not enough to repay the debt, so there will be a bad debt, this will be stored in the vault and may be solved by insurance or other methods in the future.
                    The following is the implementation of the liquidation mechanism:
                </p>
                <CodeBlock
                    code={liquidateCode}
                    language="js"
                >
                    <CodeBlock.Code className="bg-black">
                        <CodeBlock.LineContent>
                            <CodeBlock.Token />
                        </CodeBlock.LineContent>
                    </CodeBlock.Code>
                </CodeBlock>

                <h3>4.5 Price Oracle</h3>
                <p>We use Chainlink's price feeds for reliable ETH/USD price data:</p>
                <CodeBlock
                    code={oracleCode}
                    language="js"
                >
                    <CodeBlock.Code className="bg-black">
                        <CodeBlock.LineContent>
                            <CodeBlock.Token />
                        </CodeBlock.LineContent>
                    </CodeBlock.Code>
                </CodeBlock>

                <h2>5. Testing and Deployment</h2>
                <p>We run our contract at local network first, just like the following code: </p>
                <CodeBlock
                    language='text'
                    code={testCode}
                >
                    <CodeBlock.Code className="bg-black">
                        <CodeBlock.LineContent>
                            <CodeBlock.Token />
                        </CodeBlock.LineContent>
                    </CodeBlock.Code>
                </CodeBlock>
                <p>And then we should add some test cases by following the <a target="_blank" href='https://archive.trufflesuite.com/docs/truffle/how-to/debug-test/test-your-contracts/'>truffle test framework</a></p>
                <p>
                    And finally, we can deploy the contract to the Sepolia testnet, we should add a file called 1_deploy_contracts.js in the migrations folder, and add the following code:
                </p>
                <CodeBlock
                    language='js'
                    code={deployCode}
                >
                    <CodeBlock.Code className="bg-black">
                        <CodeBlock.LineContent>
                            <CodeBlock.Token />
                        </CodeBlock.LineContent>
                    </CodeBlock.Code>
                </CodeBlock>
                <p>Then we can deploy the contract by running the following command:</p>
                <CodeBlock
                    language='text'
                    code={deloyCommand}
                >
                    <CodeBlock.Code className="bg-black">
                        <CodeBlock.LineContent>
                            <CodeBlock.Token />
                        </CodeBlock.LineContent>
                    </CodeBlock.Code>
                </CodeBlock>
                <p>
                    And finally, we can interact with the contract by developing a simple frontend, and we can find the contract address in the output while deploying:
                </p>
                <CodeBlock
                    language='text'
                    code={deployOutput}
                >
                    <CodeBlock.Code className="bg-black">
                        <CodeBlock.LineContent>
                            <CodeBlock.Token />
                        </CodeBlock.LineContent>
                    </CodeBlock.Code>
                </CodeBlock>
                <p>You can get full code from <a target="_blank" href='https://github.com/coolzeta/coolzeta.github.io/tree/master/app/apps/web3/(dapps)/dapp-1/ZetaCoin'>here</a></p>
                <p>I will also provide a simple dapp for this contract, you can play it <a target="_blank" href='https://zeta.lol/apps/web3/dapp-1'>here (still developing)</a></p>
            </BlogPost>

        </>
    );
}
