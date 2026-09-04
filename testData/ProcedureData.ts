import { CreateContainerData } from '#/pageObjects/Container/ContainerGeneralInfoTab'
import { ContactsPageConfig } from '#/pageObjects/Procedure/ProcedureContactsTab'
import { CreateProcedureParamsData } from '#/pageObjects/Procedure/ProcedureParamsTab'
import { PositionParamsData } from '#/pageObjects/Procedure/ProcedurePositionTab'
import { Questionary } from '#/pageObjects/Procedure/ProcedureQuestionnaireTab'
import {
  ProcedureRequestParams,
  ProlongationByBestPriceParams,
  ProlongationByRequestParams
} from '#/pageObjects/Procedure/ProcedureRequestParamsTab'
import { runnerName } from '#/utils/elkLogin'

import { nanoid } from 'nanoid'

export type ProcedureData = {
  container: CreateContainerData
  procedure: CreateProcedureParamsData
  requestParam: ProcedureRequestParams
  contacts?: ContactsPageConfig
  questionary: Questionary
  position: PositionParamsData
}

export const defaultProcedureData: ProcedureData = {
  container: {
    containerUuid: '',
    registryNumber: '',
    containerTitle: `container ${nanoid()} by ${runnerName}`,
    procedureType: 'Попозиционная закупка',
    customName: '', //  `custom ${nanoid()} by ${runnerName}`
    addFileConfig: undefined
  },
  procedure: {
    procedureUuid: '',
    procedureTitle: `procedure ${nanoid()} by ${runnerName}`,
    internalNumber: '',
    currency: 'Рубль',
    privateProcedure: {
      private: false
    },
    addFileName: undefined,
    procedureDate: {
      step: 'Прием заявок',
      dateFinish: { week: 2 }
    }
  },
  requestParam: {
    multiCurrency: false,
    priceVat: 'Без НДС',
    volumeControl: '',
    positionControl: '',
    analogs: '',
    ratingAnalog: '',
    prolongationByRequest: {
      active: false,
      requestCount: 0,
      prolongationTimer: 0,
      prolongationQuantity: 0
    },
    prolongationByBestPrice: {
      active: false,
      timeout: 0,
      prolongationTimer: 0,
      prolongationQuantity: 0
    }
  },
  contacts: undefined,
  questionary: [],
  position: {
    okpdParam: 'По отдельным позициям',
    okpd: undefined,
    deliveryParam: 'По всем позициям',
    conditional: 'тест - Условия оплаты и поставки',
    address: 'тест - Адрес поставки',
    date: 'тест - Предполагаемая дата поставки / выполнения работ (услуг)',
    position: [
      {
        positionTitle: 'Позиция 1',
        quantity: '10',
        okpd: 'авокадо',
        okei: 'АБОНЕНТ',
        conditional: undefined,
        address: undefined,
        date: undefined,
        requirements: []
      }
    ]
  }
}

export type SinglePriceProcedureData = {
  container: CreateContainerData
  procedure: CreateProcedureParamsData
  requestParam: {
    priceVat?: string
    analogs?: string
    prolongationByRequest?: ProlongationByRequestParams
    prolongationByBestPrice?: ProlongationByBestPriceParams
  }
  contacts?: ContactsPageConfig
  questionary: Questionary
  position: PositionParamsData
}
