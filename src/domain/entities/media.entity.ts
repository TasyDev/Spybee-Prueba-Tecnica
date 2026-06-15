import { MediaStatus } from "@value-objects/media-status.vo"

export interface MediaProps {
  id: string
  incidentId: string | null
  name: string
  type: string
  format: string
  sizeBytes: number
  status: MediaStatus
  url: string
}

export class Media {
  private constructor(private readonly props: MediaProps) {}

  get id() { return this.props.id }
  get incidentId() { return this.props.incidentId }
  get name() { return this.props.name }
  get type() { return this.props.type }
  get format() { return this.props.format }
  get sizeBytes() { return this.props.sizeBytes }
  get status() { return this.props.status }
  get url() { return this.props.url }

  static create(props: MediaProps): Media {
    return new Media({ ...props })
  }

  toProps(): MediaProps {
    return { ...this.props }
  }
}
