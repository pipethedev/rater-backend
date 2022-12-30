/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Event from '@ioc:Adonis/Core/Event'
import AllocationService from 'App/Services/AllocationService'
import { container } from 'tsyringe'

const allocationService = container.resolve(AllocationService)

Event.on('create:allocation', async ({ song_id } : { song_id: string}) => {
  await allocationService.create(song_id)
})