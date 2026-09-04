import { CreateContainerData } from '#/pageObjects/Container/ContainerGeneralInfoTab'
import { Page } from '@playwright/test'
import { SinglePriceProcedure } from './Procedure/SinglePriceProcedure'
import { PositionalProcedure } from './Procedure/PositionalProcedure'

export function createProcedure(page: Page, containerData: CreateContainerData) {
  if (containerData.procedureType === 'Закупка по единичным расценкам') {
    return new SinglePriceProcedure(page)
  }

  return new PositionalProcedure(page)
}
export { PositionalProcedure }
