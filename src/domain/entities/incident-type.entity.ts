export interface IncidentTypeProps {
  id: string
  key: string
  nameEs: string
  nameEn: string
}

export class IncidentType {
  private constructor(private readonly props: IncidentTypeProps) {}

  get id() { return this.props.id }
  get key() { return this.props.key }
  get nameEs() { return this.props.nameEs }
  get nameEn() { return this.props.nameEn }

  static create(props: IncidentTypeProps): IncidentType {
    return new IncidentType({ ...props })
  }

  toProps(): IncidentTypeProps {
    return { ...this.props }
  }
}
