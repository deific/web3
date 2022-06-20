//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
// 导入依赖
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./FlashLoanReceiverBase.sol";
import "./ILendingPoolAddressesProvider.sol";
import "./ILendingPoolV1.sol";
import "hardhat/console.sol";

/**
    contract:
        FlashloanV1:
            闪电贷合约
            继承名为 FlashLoanReceiverBaseV1 的抽象合约
            它提供了必要的实现细节
            如闪电贷的偿还
**/
contract FlashloanV1 is FlashLoanReceiverBaseV1 {
    using SafeMath for uint256;

    // AAVE 中 DAI 借贷池的地址
    constructor(address _addressProvider)
        FlashLoanReceiverBaseV1(_addressProvider)
    {
        console.log("created:", _addressProvider);
    }

    /**
        function:
            flashloan: 执行闪电贷
        params:
            _asset: 闪电贷的资产池子地址, 本例子中为: DAI
            amount: 贷款总金额
        visibility:
            public: 通过内部, 或者消息来进行调用
            onlyOwner: 仅合约持有者可调用
    **/
    function flashloan(address _asset, uint amount) public onlyOwner {
        console.log("start flashloan: %s %s", _asset, amount);
        // 本次不需要任何闪电贷的数据, 传递一个空字符串
        bytes memory data = "";
        console.log("start address: %s ", msg.sender);

        console.log(
            "start lendingPool: %s ",
            addressesProvider.getLendingPool()
        );
        // 通过 Aave 提供的 ILendingPoolV1 初始化 LendingPool 接口, 调用 flashLoan 函数
        ILendingPoolV1 lendingPool = ILendingPoolV1(
            addressesProvider.getLendingPool()
        );

        // 调用 flashLoan 函数
        /** params:
            _receiver: 接收贷款的地址, 此处为当前合约地址
            _reserve: 传递资产地址, 此处为 Kovan 中 DAI 地址
            _amount: 借款金额, 此处为 1 DAI
            _params: 可调用参数, 此处为空数据
        **/
        console.log("flashLoaning: %s %s", _asset, amount);
        lendingPool.flashLoan(address(this), _asset, amount, data);
    }

    /**
        function:
            executeOperation: 执行借款
        params:
            _reserve: 所借代币的合约地址
            _amount: 借款金额
            _fee: 偿还利息
            _params: 可调用参数
        returns:
            allBalance: 可借贷金额上限
    **/
    function executeOperation(
        address _reserve,
        uint256 _amount,
        uint256 _fee,
        bytes calldata _params
    ) external override {
        // 检查由池子可向本地址借贷的代币上限, 若小于目标贷款金额, 提示错误
        require(
            _amount <= getBalanceInternal(address(this), _reserve),
            "Insufficient liquidity pool balance"
        );

        /**
            借贷逻辑核心函数
        **/
        console.log("executeOperation before: %s %s", _reserve, _fee);
        // 总贷款金额加入偿还利息
        uint totalDebt = _amount.add(_fee);
        // 归还总贷款金额
        transferFundsBackToPoolInternal(_reserve, totalDebt);
        console.log("executeOperation after: %s %s", _reserve, totalDebt);
    }
}
