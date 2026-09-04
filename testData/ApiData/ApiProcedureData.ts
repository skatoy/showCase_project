import { runnerName, userCreds } from '#/utils/elkLogin'
import { nanoid } from 'nanoid'

export const defaultApiProcedureData = {
  container: {
    type: 'POSITIONS_TENDER' as const,
    title: `container ${nanoid()} by ${runnerName}`,
    documents: [],
    documentsConfig: [
      {
        name: 'Документы для подачи заявки на каждый лот',
        description: 'Загрузите документы для подачи заявки',
        isRequired: false,
        uuid: '',
        _key: ''
      }
    ]
  },
  procedureInfo: {
    title: `procedure ${nanoid()} by ${runnerName}`,
    positionControl: 'ALL_POSITION',
    volumeControl: 'ALL_VOLUME_POSITION',
    isWithoutPrice: true,
    allowOfferHigherLotPrice: true,
    isCustomerContactsHidden: false,
    currency: 'RUB',
    isPrivate: false,
    allowedSuppliers: [],
    contacts: [
      {
        email: userCreds.userBothRoles.email,
        firstName: userCreds.userBothRoles.contactFirstName,
        lastName: userCreds.userBothRoles.contactLastName,
        middleName: userCreds.userBothRoles.contactMidleName,
        phone: userCreds.userBothRoles.contactPhone
      }
    ],
    customers: [
      {
        fullName: userCreds.userBothRoles.fullName,
        inn: userCreds.userBothRoles.inn,
        kpp: userCreds.userBothRoles.kpp,
        participantType: 'ul',
        isResident: true,
        isResidentCis: false
      }
    ],
    organizer: {
      fullName: userCreds.userBothRoles.fullName,
      inn: userCreds.userBothRoles.inn,
      kpp: userCreds.userBothRoles.kpp,
      participantType: 'ul',
      isResident: true,
      isResidentCis: false
    },
    deliveryCondition: 'тест - Условия оплаты и поставки',
    deliveryAddress: 'тест - Адрес поставки',
    deliveryDate: 'тест - Предполагаемая дата поставки / выполнения работ (услуг)',
    internalNumber: '',
    privateProcedure: { private: false },
    isMultiCurrencyAllowed: false,
    isVatAllowed: false,
    isAnalogAllowed: false,
    isTechnicalOffersWithQuantity: false,
    isRatingWithAnalogs: false,
    supplierInfoVisibilitySettings: {
      isEnabled: false,
      supplierInfoVisibility: []
    },
    isProlongateByRequestCount: false,
    prolongationRequestCount: '',
    isProlongateByBestOffer: false,
    prolongationPossibleTimeBeforeEnd: '',
    bestOfferProlongationTime: '',
    bestOfferProlongationMaxCount: '',
    requestCountProlongationTime: '',
    requestCountProlongationMaxCount: '',
    documentsConfig: [
      {
        name: 'Документы лота',
        description: 'Загрузите документы для подачи заявки',
        isRequired: false,
        uuid: '',
        _key: ''
      }
    ],
    isOfferForRelatedPositionRequired: false,
    isOkpdByProcedure: false,
    okpdList: [],
    isDeliveryByPosition: false,
    questionary: {
      isEnabled: false,
      questionList: []
    },
    requirementSettings: {
      isEnabled: false,
      requirementList: []
    },
    documents: []
  },
  positions: [
    {
      title: `Позиция 1`,
      quantity: '10',
      price: '',
      okpd: '01.22.11',
      okpdName: 'Авокадо',
      okei: '7923',
      okeiName: 'Абонент',
      okeiShortName: 'АБОНЕНТ',
      type: '7923',
      requirementSettings: {
        isEnabled: false,
        requirementList: []
      },
      deliveryCondition: '',
      deliveryAddress: '',
      deliveryDate: '',
      description: '',
      isForPriceList: false
    }
  ]
}
