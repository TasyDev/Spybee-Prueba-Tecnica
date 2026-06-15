export interface IncidentTypeProps {
  id: string
  key: string
  nameEs: string
  nameEn: string
  description: string | null
}

export class IncidentType {
  private constructor(private props: IncidentTypeProps) {}

  get id() { return this.props.id }
  get key() { return this.props.key }
  get nameEs() { return this.props.nameEs }
  get nameEn() { return this.props.nameEn }
  get description() { return this.props.description }

  static create(props: IncidentTypeProps): IncidentType {
    return new IncidentType({ ...props })
  }

  toProps(): IncidentTypeProps {
    return { ...this.props }
  }

  updateNameEs(nameEs: string): void {
    this.props.nameEs = nameEs
  }

  updateNameEn(nameEn: string): void {
    this.props.nameEn = nameEn
  }

  updateKey(key: string): void {
    this.props.key = key
  }

  updateDescription(description: string | null): void {
    this.props.description = description
  }
}
