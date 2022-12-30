import { RatingLevel } from 'App/Enum'
import SongRepository from 'App/Repository/SongRepository'
import AllocationService from 'App/Services/AllocationService'
import { BaseTask } from 'adonis5-scheduler/build'
import { container } from 'tsyringe'

export default class AssignAllocation extends BaseTask {
	protected allocationService = container.resolve(AllocationService)
	protected songRepository = container.resolve(SongRepository)
	
	public static get schedule() {
		return '* * * * * *'
	}

	public static get useLock() {
		return false
	}

	public async handle() {
    	const songs = await this.songRepository.findByRating(RatingLevel.Fair)
		for (let song of songs) {
			await this.allocationService.create(song.id)
		}
  	}
}
