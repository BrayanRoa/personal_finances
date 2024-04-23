
import { CreateWalletDto } from "../../domain/dtos/wallet/create-wallet.dto";
import { UpdateWalletDto } from "../../domain/dtos/wallet/update-wallet.dto";
import { SharedMiddleware } from "../../utils/middleware/base.middleware";

export class WalletMiddleware extends SharedMiddleware<CreateWalletDto, UpdateWalletDto> {

    constructor() {
        super(CreateWalletDto, UpdateWalletDto)
    }

}