import { DateInput } from '#/components/DateInput'
import { Select } from '#/components/Select'
import { TextInput } from '#/components/TextInput'
import { BaseModal } from '#/pageObjects/Modal/Modals'
import { Locator, Page } from '@playwright/test'
import { DurationLikeObject } from 'luxon'
import * as allure from 'allure-js-commons'

export const groupsNames = {
  'Авторизация': 'auth',
  'Авторизация админа': 'authAdmin',
  'Журнал организаций': 'organization',
  'Админка': 'admin',
  'Протокол': 'protocol',
  'Заявка': 'request',
  'Финансы': 'finance',
  'Закупка': 'procedure',
  'Справочники': 'reference',
  'Уведомления': 'notificator',
  'Файловый сервис': 'filestorage',
  'Парсер': 'fileparser',
  'Датагрид': 'datagrid',
  'Фасад чатов': 'chatfacade',
  'Торги': 'trade',
  'Счетчики': 'counter'
}
export const idMethod = {
  a1: 'common.service.auth.External.GetUserInfo_Получить информацию по профилю пользователя',
  a2: 'common.service.auth.External.GetOrganizationList_Получение списка организаций',
  a3: 'common.service.auth.External.GetRolesByOrganization_Получение ролей пользователя',
  a4: 'common.service.auth.External.SaveOrganizationSelect_Сохранение выбора организации',
  a5: 'common.service.auth.External.GetPermissions_Получение разрешений',
  a6: 'common.service.auth.External.CheckAccessService_Проверка доступа к сервису',
  a7: 'common.service.auth.External.LoginWithToken_Авторизация пользователя',
  a8: 'common.service.auth.External.LogoutWithToken_Выход из системы',
  a9: 'common.service.auth.External.OrganizationAutocomplete_Получение списка организаций для автозаполнения',
  a10: 'common.service.auth.External.AboutMe_Получить данные о текущей организации и её пользователях',
  a11: 'common.service.auth.External.CreatePrimaReport_Создать отчёт в Прима Информ',
  aa1: 'common.service.auth.AdminExternal.AdminLoginWithToken_Авторизация в административной части',
  aa2: 'common.service.auth.AdminExternal.SaveSelectedRole_Сохранение выбранной роли в административной части',
  aa3: 'common.service.auth.AdminExternal.GetRoles_Получение списка ролей в административной части',
  o1: 'common.service.organization.AdminExternal.HubSearch_Поиск в хабе по ИНН',
  o2: 'common.service.organization.AdminExternal.Add_Добавить организацию в реестр',
  o3: 'common.service.organization.AdminExternal.SetSettings_Сохранить настройки организации в реестре',
  o4: 'common.service.organization.Grid.Grid_Список организаций в реестре',
  admin1: 'common.service.admin.External.SaveAccessLog_Добавление записи в журнал операций',
  admin2: 'common.service.admin.External.GetAccessLog_Получение записей из журнала операций',
  prot1: 'common.service.protocol.External.Get_Получение протокола',
  prot2: 'common.service.protocol.External.GetDraft_Получение черновика протокола',
  prot3: 'common.service.protocol.External.Save_Сохранение протокола',
  prot4: 'common.service.protocol.External.Publish_Публикация протокола',
  prot5: 'common.service.protocol.External.ResetDecision_Сброс решения по протокола',
  prot6:
    'common.service.protocol.External.GetPositions_Получение позиций при попозиционном решении',
  prot7: 'common.service.protocol.External.GetReview_Получение акта рассмотрения заявок',
  prot8:
    'common.service.protocol.External.GetReviewDraft_Получение черновика акта рассмотрения заявок',
  prot9: 'common.service.protocol.External.SaveReview_Сохранение акта рассмотрения заявок',
  prot10: 'common.service.protocol.External.GetProtocolList_Получение списка протоколов',
  prot11: 'common.service.protocol.External.EditVisibility_Редактирование видимости протокола',
  prot12: 'common.service.protocol.External.WinnersAutoSelect_Автовыбор победителя протокола',
  prot13: 'common.service.protocol.External.ForcePublish_Принудительная публикация протокола',
  r1: 'common.service.request.External.Get_Получение заявки',
  r2: 'common.service.request.External.Save_Сохранение заявки',
  r3: 'common.service.request.External.PositionSave_Сохранение позиции по заявке',
  r4: 'common.service.request.External.Publish_Публикация заявки',
  r5: 'common.service.request.External.GetPositions_Получение позиций по заявке/закупке',
  r6: 'common.service.request.External.GetProcedureSuppliers_Получение поставщиков по закупке',
  r7: 'common.service.request.External.Cancel_Отмена заявки',
  r8: 'common.service.request.External.RequestCountByProcedureAndSupplier_Получение количества заявок для выбранной закупки в зависимости от роли',
  r9: 'common.service.request.Grid.Grid_Просмотр журнала заявок',
  r10: 'common.service.request.External.GetDraft_Получение черновика заявки',
  r11: 'common.service.request.External.GetSupplierPositions_Список предложений по позиции закупки',
  r12: 'common.service.request.Grid.SupplierRequestGrid_Получение списка заявок конкурентов',
  r13: 'common.service.request.External.GetPositionsWithOffers_Получение позиций по закупке с данными о предложениях',
  r14: 'common.service.request.External.GetProcedureBestPrice_Получение цены лучшего предложения в валюте лота',
  r15: 'common.service.request.External.AutoCorrection_Автоматически подбить цены под результат очной переторжки',
  r16: 'common.service.request.External.CheckPositions_Проверка позиций',
  r17: 'common.service.request.External.ImproveRequest_Отправить заявку на доработку',
  r18: 'common.service.request.External.GetSameIPGroups_Получить группы поставщиков с одним IP адресом',
  f1: 'common.service.finance.External.AccountInfo_Получение информации по аккаунту биллинга',
  f2: 'common.service.finance.External.DocumentList_Получение документов биллинга(УПД)',
  f3: 'common.service.finance.External.OperationList_Получение платежных операций',
  f4: 'common.service.finance.External.PaymentOrder_Получение платежного поручения',
  f5: 'common.service.finance.External.TariffInfo_Получение информации по тарифам',
  f6: 'common.service.finance.External.BlockDerivation_Блокировка средств',
  f7: 'common.service.finance.External.BillingRequestLog_Получение лога биллинга',
  f8: 'common.service.finance.External.BuyTariff_Покупка тарифа',
  proc1: 'common.service.procedure.External.Get_Получение закупки',
  proc2: 'common.service.procedure.External.GetDraft_Получение черновика закупки',
  proc3: 'common.service.procedure.External.Save_Сохранение закупки',
  proc4: 'common.service.procedure.External.CheckPositions_Проверка позиций',
  proc5: 'common.service.procedure.External.Publish_Публикация закупки',
  proc6: 'common.service.procedure.External.Cancel_Отмена закупки',
  proc7: 'common.service.procedure.External.RebiddingPublish_Публикация уторговывания',
  proc8: 'common.service.procedure.External.GetPositionsByProcedure_Получение позиций по закупке',
  proc9: 'common.service.procedure.External.SavePositions_Сохранение позиций черновика',
  proc10: 'common.service.procedure.External.RemoveAllPositions_Удаление позиций черновика',
  proc11: 'common.service.procedure.External.ResetDraft_Сброс черновика',
  proc12:
    'common.service.procedure.Grid.ProlongationHistoryGrid_Получение истории продлений закупки',
  proc13: 'common.service.procedure.External.RemovePositions_Удаление списка позиций из закупки',
  proc14: 'common.service.procedure.External.EditBannerConfig_Редактирование баннера закупки',
  proc15: 'common.service.procedure.External.Copy_Создание копии закупки',
  proc16: 'common.service.procedure.ContainerExternal.Get_Получить контейнер закупки',
  proc17: 'common.service.procedure.ContainerExternal.GetDraft_Получить черновик закупки',
  proc18: 'common.service.procedure.ContainerExternal.Save_Сохранить контейнер закупки',
  proc20: 'common.service.procedure.ContainerExternal.Copy_Создание копии контейнера закупок',
  proc21: 'common.service.procedure.ContainerExternal.Publish_Опубликовать закупку',
  proc22: 'common.service.procedure.ContainerExternal.Cancel_Отменить лоты закупки',
  proc23: 'common.service.procedure.External.RemoveDraft_Удаление лота в статусе черновик',
  proc24:
    'common.service.procedure.External.CommercialOffersAcceptancePublish_Объявление приема коммерческих предложений',
  proc25: 'common.service.procedure.External.RebiddingTradePublish_Публикация очной переторжки',
  proc26:
    'common.service.procedure.ContainerExternal.RemoveDraft_Удаление закупки в статусе черновик',
  proc27: 'common.service.procedure.External.ForcePublish_Принудительная публикация лота',
  proc28: 'common.service.procedure.External.Restore_Восстановление лота на предыдущий этап',
  proc29: 'common.service.procedure.External.ForceCancel_Принудительная отмена лота',
  ref1: 'common.service.reference.External.GetReferences_Получение значений справочников',
  ref2: 'common.service.reference.External.GetReference_Получение значения справочника',
  ref3: 'common.service.reference.External.GetAvailableList_Получение списка справочников',
  ref4: 'common.service.reference.External.GetCurrencyExchangeRate_Получение курса валюты',
  ref5: 'common.service.reference.External.GetCurrencyExchangeRateLast_Получение последних курсов валюты',
  n1: 'common.service.notificator.External.DepositIncreaseNotification_Отправка запроса на увеличения депозита',
  n2: 'common.service.notificator.External.TenderSupportRequestNotification_Отправка запроса на тендерное сопровождение',
  n3: 'common.service.notificator.External.SendManuallyFromCustomer_Отправка уведомлений вручную заказчиком по лоту',
  n4: 'common.service.notificator.External.LogGrid_Просмотр журнала уведомлений',
  n5: 'common.service.notificator.External.GetMailLogBody_Просмотр тела уведомления',
  n6: 'common.service.notificator.Grid.HistoryGrid_Просмотр журнала уведомлений',
  n7: 'common.service.notificator.External.SendManuallyContainerFromCustomer_Отправка уведомлений вручную заказчиком по закупке',
  n8: 'common.service.notificator.External.SendManuallyToEmailsList_Отправка уведомлений вручную по списку адресов',
  fs1: 'FS.common.service.procedure.External.Get_Получение файла закупки',
  fs2: 'FS.common.service.request.External.Get_Получение файла заявки',
  fs3: 'FS.common.service.protocol.External.Get_Получение файла протокола',
  fs4: 'FS.common.service.organization.AdminExternal.Get_Получение файла организации',
  fs5: 'FS.common.service.fs.procedure.Upload_Загрузка файла процедуры',
  fs6: 'FS.common.service.fs.request.Upload_Загрузка файла заявки',
  fs7: 'FS.common.service.fs.protocol.Upload_Загрузка файла протокола',
  fs8: 'FS.common.service.fs.organization.Upload_Загрузка файла организации',
  fs9: 'FS.common.service.fs.procedure.Download_Скачивание файла процедуры',
  fs10: 'FS.common.service.fs.request.Download_Скачивание файла заявки',
  fs11: 'FS.common.service.fs.protocol.Download_Скачивание файла протокола',
  fs12: 'FS.common.service.fs.organization.Download_Скачивание файла организации',
  fs13: 'FS.common.service.procedure.External.getFile_Получение файла закупки',
  fs14: 'FS.common.service.request.External.getFile_Получение файла заявки',
  fs15: 'FS.common.service.protocol.External.getFile_Получение файла протокола',
  fs16: 'FS.common.service.organization.AdminExternal.getFile_Получение файла организации',
  fs17: 'FS.common.service.fs.procedure.getFile_Получение файла из черновика процедуры',
  fs18: 'FS.common.service.fs.request.getFile_Получение файла из черновика заявки',
  fs19: 'FS.common.service.fs.protocol.getFile_Получение файла из черновика протокола',
  fs20: 'FS.common.service.fs.organization.getFile_Получение файла из черновика организации',
  fs21: 'FS.common.service.fs.procedure.saveFile_Загрузка файла процедуры',
  fs22: 'FS.common.service.fs.request.saveFile_Загрузка файла заявки',
  fs23: 'FS.common.service.fs.protocol.saveFile_Загрузка файла протокола',
  fs24: 'FS.common.service.fs.organization.saveFile_Загрузка файла организации',
  fs25: 'FS.common.service.fs.procedure.removeFile_Удаление файла из черновика закупки',
  fs26: 'FS.common.service.fs.request.removeFile_Удаление файла из черновика заявки',
  fs27: 'FS.common.service.fs.protocol.removeFile_Удаление файла из черновика протокола',
  fs28: 'FS.common.service.fs.organization.removeFile_Удаление файла из организации',
  fs29: 'common.service.filestorage.External.ArchiveProcedureFiles_Задача на создание архива по закупке',
  fs30: 'common.service.filestorage.External.ArchiveRequestFiles_Задача на создание архива по заявке',
  fs31: 'common.service.filestorage.External.ArchiveMessageProcedureFiles_Задача на создание архива по сообщению в закупке',
  fs32: 'common.service.filestorage.External.ArchiveMessageRequestFiles_Задача на создание архива по сообщению в заявке',
  fs33: 'FS.common.service.fs.procedure.archive_Получение архива файлов закупки',
  fs34: 'FS.common.service.fs.request.archive_Получение архива файлов заявки',
  fs35: 'FS.common.service.fs.procedure.message.archive_Получение архива файлов сообщения по лоту',
  fs36: 'FS.common.service.fs.container.message.archive_Получение архива файлов сообщения по закупке',
  fs37: 'FS.common.service.fs.request.message.archive_Получение архива файлов сообщения по заявке',
  fs38: 'FS.common.service.chatfacade.External.getFile_Получение файла сообщения по заявке / закупке / лоту',
  fs39: 'FS.common.service.fs.procedure.container.saveFile_Загрузка файла контейнера закупки',
  fs40: 'FS.common.service.fs.procedure.container.getFile_Получение файла из черновика контейнера закупки',
  fs41: 'FS.common.service.fs.procedure.container.removeFile_Удаление файла из черновика контейнера закупки',
  fs42: 'FS.common.service.procedure.ContainerExternal.getFile_Получение файла контейнера закупки',
  fp1: 'common.service.fileparser.External.ExportProcedurePositions_Экспорт шаблона для заполнения позиций закупки',
  fp2: 'common.service.fileparser.External.ExportRequestPositions_Экспорт шаблона для заполнения основных атрибутов позиций и аналогов заявки',
  fp3: 'common.service.fileparser.External.ImportProcedurePositions_Импорт шаблона для заполнения позиций закупки',
  fp4: 'common.service.fileparser.External.ImportRequestPositions_Импорт шаблона для заполнения основных атрибутов позиций и аналогов заявки',
  fp5: 'FP.common.service.fileparser.External.ImportProcedurePositions_Импорт шаблона для заполнения позиций закупки (результат)',
  fp6: 'FP.common.service.fileparser.External.ImportRequestPositions_Импорт шаблона для заполнения позиций заявки (результат)',
  fp7: 'common.service.fileparser.External.GetTask_Получение результатов таски',
  fp8: 'common.service.fileparser.External.CreateCompetitiveList_Создать конкурентный лист по закупке',
  fp9: 'common.service.fileparser.External.ExportRequestRequirements_Экспорт шаблона для заполнения ответов на требования заявки',
  fp10: 'common.service.fileparser.External.ImportRequestRequirements_Импорт шаблона для заполнения ответов на требования заявки',
  fp11: 'FP.common.service.fileparser.External.ImportRequestRequirements_Импорт шаблона для заполнения ответов на требования заявки (результат)',
  fp12: 'common.service.fileparser.External.GetSameIPGroups_Получить группы поставщиков с одним IP адресом (файл)',
  dg3: 'common.service.datagrid.ProcedureGrid.GetProcedureEventLogGrid_Просмотреть журнал операций закупки',
  dg4: 'common.service.datagrid.ProcedureGrid.ProcedureGrid_Просмотр журнала закупок',
  dg5: 'common.service.datagrid.ProcedureGrid.ProcedureDraftGrid_Просмотр черновиков в журнале закупок',
  dg6: 'common.service.datagrid.ProcedureGrid.ContainerGrid_Просмотр списка контейнеров закупок',
  dg7: 'common.service.datagrid.ProcedureGrid.ContainerDraftGrid_Просмотр списка контейнеров закупок в статусе черновик',
  dg8: 'common.service.datagrid.ProcedureGrid.GetContainerRequestCounters_Получить счетчики заявок по лотам контейнера',
  dg9: 'common.service.datagrid.ProcedureGrid.GetProcedureViewList_Получить просмотры закупок в разрезе лотов',
  dg10: 'common.service.datagrid.ProcedureGrid.GetProcedureViewByOrganizations_Получить просмотры закупки по организациям',
  dg11: 'common.service.datagrid.ProcedureGrid.GetProcedureViewByUsers_Получить просмотры закупки по пользователям в разрезе организации',
  cf1: 'common.service.chatfacade.External.SendProcedureMessage_Отправка сообщения по закупке',
  cf2: 'common.service.chatfacade.External.GetProcedureMessages_Получение сообщений по закупке',
  cf3: 'common.service.chatfacade.External.SendRequestMessage_Отправка сообщения по заявке',
  cf4: 'common.service.chatfacade.External.GetRequestMessages_Получение сообщений по заявке',
  cf5: 'common.service.chatfacade.External.GetRequestChatDetails_Получение чата с сообщениями по заявке',
  cf6: 'common.service.chatfacade.Grid.RequestGrid_Список чатов по заявкам для текущей организации / пользователя',
  cf7: 'common.service.chatfacade.External.getFile_Получение файла сообщения по заявке / закупке',
  cf8: 'common.service.chatfacade.External.GetContainerMessages_Получение сообщений по контейнеру закупки',
  cf9: 'common.service.chatfacade.Grid.UnreadChatsCount_Количество непрочитанных чатов по вкладкам',
  cf10: 'common.service.chatfacade.External.SetMessageImportance_Изменения важности сообщения',
  cf11: 'common.service.chatfacade.External.CheckChatMessage_Отметить сообщения как прочитанное',
  tr1: 'common.service.trade.External.Get_Получить информацию о торгах',
  tr2: 'common.service.trade.External.GetListByProcedure_Получить информацию о торгах процедуры (лота)',
  tr3: 'common.service.trade.External.AddOffer_Добавить предложение',
  tr4: 'common.service.trade.External.Cancel_Отменить торги',
  cn1: 'common.service.counter.External.Increment_Увеличить счетчик'
}
export type MethodGroup = keyof typeof groupsNames
export type MethodId = keyof typeof idMethod

export class OperationsAndErrors {
  readonly page: Page
  readonly totalCount: Locator
  readonly reloadTableIcon: Locator
  readonly filterTableIcon: Locator
  readonly recordListTable: Locator
  readonly recordDate: Locator
  readonly recordUser: Locator
  readonly recordAction: Locator
  readonly recordProcedureNumber: Locator
  readonly recordStatus: Locator
  readonly modal: BaseModal
  readonly filterBody: Locator
  readonly filterUuidAction: TextInput
  readonly filterUserLogin: TextInput
  readonly filterDateFrom: DateInput
  readonly filterDateTo: DateInput
  readonly filterUserName: TextInput
  readonly filterOrganizationNameInput: TextInput
  readonly filterOrganizationInnInput: TextInput
  readonly filterOrganizationKppInput: TextInput
  readonly filterStatus: Select
  readonly filterProcedureNumberInput: TextInput
  readonly filterOnlyIntegrationCheckbox: Locator
  readonly filtredMethod: Locator
  readonly filterMethodSearchInput: Select
  readonly filterMethodSearchIcon: Locator
  readonly filterCheckAll: Locator
  readonly filterGroupContent: Locator

  constructor(page: Page) {
    this.page = page
    this.totalCount = page.getByTestId('total-count-title')
    this.reloadTableIcon = page.getByTestId('icon-restart')
    this.filterTableIcon = page.getByTestId('filters')
    this.recordListTable = page.getByTestId('table-loaded')
    this.recordDate = page.getByTestId('table-col-eventTime')
    this.recordUser = page.getByTestId('table-col-username')
    this.recordUser = page.getByTestId('table-col-username')
    this.recordAction = page.getByTestId('table-col-serviceName')
    this.recordProcedureNumber = page.getByTestId('table-col-procedureRegistryNumber')
    this.recordStatus = page.getByTestId('table-col-isSuccess')
    this.modal = new BaseModal(page)
    this.filterBody = this.modal.window
    this.filterUuidAction = new TextInput(page.getByTestId('uuid-input'))
    this.filterUserLogin = new TextInput(page.getByTestId('username-input'))
    this.filterDateFrom = new DateInput(page.getByTestId('date-picker--from'))
    this.filterDateTo = new DateInput(page.getByTestId('date-picker--to'))
    this.filterUserName = new TextInput(page.getByTestId('user-full-name-input'))
    this.filterOrganizationNameInput = new TextInput(page.getByTestId('organization-name-input'))
    this.filterOrganizationInnInput = new TextInput(page.getByTestId('organization-inn-input'))
    this.filterOrganizationKppInput = new TextInput(page.getByTestId('organization-kpp-input'))
    this.filterStatus = new Select(page.getByTestId('select-isSuccess'))
    this.filterProcedureNumberInput = new TextInput(
      page.getByTestId('procedure-registry-number-input')
    )
    this.filterOnlyIntegrationCheckbox = page.getByTestId('checkbox-isFromIntegration')
    this.filtredMethod = page.getByTestId('expander-content')
    this.filterMethodSearchInput = new Select(
      page.getByPlaceholder('Введите метод или его описание')
    )
    this.filterMethodSearchIcon = page.getByTestId('icon-search')
    this.filterCheckAll = page.getByTestId('checkbox-methodIds-select-all')
    this.filterGroupContent = page.getByTestId('expander-content')
  }

  async getTableData() {
    return await allure.step('Получить список ошибок', async () => {
      return this.recordListTable.textContent()
    })
  }

  async reloadTable() {
    await allure.step('Обновить список', async () => {
      await this.reloadTableIcon.click()
    })
  }

  async openFilter() {
    await allure.step('Открыть фильтр', async () => {
      await this.filterTableIcon.click()
      await this.modal.waitForVisible()
    })
  }

  async fillUuidFilter(uuid: string) {
    await allure.step('Заполнить поле: UUID события', async () => {
      await this.filterUuidAction.fill(uuid)
    })
  }

  async fillLoginFilter(login: string) {
    await allure.step('Заполнить поле: Логин пользователя', async () => {
      await this.filterUserLogin.fill(login)
    })
  }

  async fillFilterDateSetFrom(dateFrom: DurationLikeObject) {
    await allure.step('Заполнить поле: дата начала', async () => {
      await this.filterDateFrom.fill(dateFrom)
    })
  }

  async fillFilterDateTo(dateTo: DurationLikeObject) {
    await allure.step('Заполнить поле: дата окончания ', async () => {
      await this.filterDateTo.fill(dateTo)
    })
  }

  async fillUserNameFilter(userName: string) {
    await allure.step('Заполнить поле: ФИО пользователя', async () => {
      await this.filterUserName.fill(userName)
    })
  }

  async fillOrganizationNameFilter(organizationName: string) {
    await allure.step('Заполнить поле: Контрагент', async () => {
      await this.filterOrganizationNameInput.fill(organizationName)
    })
  }

  async fillOrganizationInnFilter(organizationInn: string) {
    await allure.step('Заполнить поле: ИНН организации', async () => {
      await this.filterOrganizationInnInput.fill(organizationInn)
    })
  }

  async fillOrganizationKppFilter(organizationKpp: string) {
    await allure.step('Заполнить поле: КПП организации', async () => {
      await this.filterOrganizationKppInput.fill(organizationKpp)
    })
  }

  async selectFilterStatus(status: string) {
    await allure.step('Выбрать статус операции', async () => {
      await this.filterStatus.select(status)
    })
  }

  async fillFilterProcedureNumber(procedureNumber: string) {
    await allure.step('Заполнить поле: Номер закупки', async () => {
      await this.filterProcedureNumberInput.fill(procedureNumber)
    })
  }

  async checkOnlyIntegrationFilter() {
    await allure.step('Выбрать: Только интеграции', async () => {
      await this.filterOnlyIntegrationCheckbox.click()
    })
  }

  async checkMethodFilter(method: MethodId) {
    await allure.step('Заполнить поле фильтра: Метод', async () => {
      const value = idMethod[method].split('_')[0]
      await this.filterMethodSearchInput.searchAndSelect(value)
    })
  }

  async showMethodGroup(group: MethodGroup) {
    await allure.step('Просмотреть методы группы', async () => {
      const groupValue = await this.page
        .getByTestId('chevron-expander-title')
        .filter({ has: this.page.getByText(group, { exact: true }) })
      groupValue.getByTestId('icon-down').click()
    })
  }

  async choiceAllMethodGroup(group: MethodGroup) {
    await allure.step('Выбрать все методы группы', async () => {
      const locatorValue = groupsNames[group]
      await this.page.getByTestId(`checkbox-methodIds-group-${locatorValue}`).click()
    })
  }

  async choiceOneMethod(methodId: MethodId) {
    await allure.step('Выбрать один метод', async () => {
      await this.page.getByTestId(`checkbox-methodIds-${methodId}`).click()
    })
  }

  async choiceMethods(groupName: MethodGroup, methodId?: MethodId[], allMethods?: boolean) {
    await allure.step('Выбрать все методы', async () => {
      if (allMethods === true) {
        await this.choiceAllMethodGroup(groupName)
      }

      if (methodId) {
        await this.showMethodGroup(groupName)

        for (const id of methodId) {
          await this.choiceOneMethod(id)
        }
      }
    })
  }
}
