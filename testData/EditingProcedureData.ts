import { EditingContainerData } from '#/pageObjects/Container/ContainerGeneralInfoTab'
import { ContactsPageConfig } from '#/pageObjects/Procedure/ProcedureContactsTab'
import { EditingProcedureParamsData } from '#/pageObjects/Procedure/ProcedureParamsTab'
import { EditingPositionData } from '#/pageObjects/Procedure/ProcedurePositionTab'
import { EditingQuestionaryData } from '#/pageObjects/Procedure/ProcedureQuestionnaireTab'
import { ProcedureRequestParams } from '#/pageObjects/Procedure/ProcedureRequestParamsTab'
import { runnerName } from '#/utils/elkLogin'
import { nanoid } from 'nanoid'

export type EditingProcedureData = {
  container?: EditingContainerData
  procedure?: EditingProcedureParamsData
  requestParam?: ProcedureRequestParams
  contacts?: ContactsPageConfig
  questionary?: EditingQuestionaryData
  position?: EditingPositionData
}

export const defaultEditingProcedureData: EditingProcedureData = {
  container: {
    containerTitle: undefined,
    customName: undefined, //  `custom ${nanoid()} by ${runnerName}`
    addFileConfig: undefined
  },
  procedure: {
    procedureTitle: `procedure ${nanoid()} by ${runnerName}`,
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
    ratingAnalog: ''
  },
  contacts: undefined,
  questionary: undefined,
  position: {
    positionTitle: 'Позиция 1',
    positionData: {
      positionTitle: 'Позиция 1',
      quantity: '10',
      okpd: 'авокадо',
      okei: 'АБОНЕНТ',
      conditional: undefined,
      address: undefined,
      date: undefined
    }
  }
}
