export const getPositionsTenderSteps = (dateStart: string, dateEnd: string) => [
  {
    number: 1,
    dateStart: dateStart,
    dateEnd: dateEnd,
    code: 'applications_acceptance',
    name: 'Прием заявок',
    additionalData: null,
    disabled: false
  },
  {
    number: 2,
    dateStart: null,
    dateEnd: null,
    code: 'summing_up',
    name: 'Подведение итогов',
    additionalData: null,
    disabled: true
  }
]

export const getQuotationRequestSteps = (dateStart: string, dateEnd: string) => [
  {
    number: 1,
    dateStart,
    dateEnd,
    code: 'applications_acceptance',
    name: 'Прием заявок',
    additionalData: null
  },
  {
    number: 2,
    dateStart: null,
    dateEnd: null,
    code: 'applications_review',
    name: 'Рассмотрение заявок',
    additionalData: null,
    disabled: true
  },
  {
    number: 3,
    dateStart: null,
    dateEnd: null,
    code: 'summing_up',
    name: 'Подведение итогов',
    additionalData: null,
    disabled: true
  }
]

export const getPositionsTenderTechOffersSteps = (dateStart: string, dateEnd: string) => [
  {
    number: 1,
    dateStart,
    dateEnd,
    code: 'technical_offers_acceptance',
    name: 'Прием технических предложений',
    additionalData: null
  },
  {
    number: 2,
    dateStart: null,
    dateEnd: null,
    code: 'applications_review',
    name: 'Рассмотрение заявок',
    additionalData: null,
    disabled: true
  },
  {
    number: 3,
    dateStart: null,
    dateEnd: null,
    code: 'commercial_offers_acceptance',
    name: 'Прием коммерческих предложений',
    additionalData: null
  },
  {
    number: 4,
    dateStart: null,
    dateEnd: null,
    code: 'summing_up',
    name: 'Подведение итогов',
    additionalData: null,
    disabled: true
  }
]

export const getSinglePriceSteps = (dateStart: string, dateEnd: string) => [
  {
    number: 1,
    dateStart,
    dateEnd,
    code: 'applications_acceptance',
    name: 'Прием заявок',
    additionalData: null
  },
  {
    number: 2,
    dateStart: null,
    dateEnd: null,
    code: 'summing_up',
    name: 'Подведение итогов',
    additionalData: null,
    disabled: true
  }
]
