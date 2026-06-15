export class Location {
  readonly latitude: number
  readonly longitude: number

  private constructor(latitude: number, longitude: number) {
    if (latitude < -90 || latitude > 90) {
      throw new Error(`Invalid latitude: ${latitude}. Must be between -90 and 90.`)
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error(`Invalid longitude: ${longitude}. Must be between -180 and 180.`)
    }
    this.latitude = latitude
    this.longitude = longitude
  }

  static create(latitude: number, longitude: number): Location {
    return new Location(latitude, longitude)
  }
}
