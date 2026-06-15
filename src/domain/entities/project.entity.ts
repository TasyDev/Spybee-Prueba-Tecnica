export interface ProjectProps {
  id: string
  name: string
  description: string | null
  location: string | null
}

export class Project {
  private constructor(private props: ProjectProps) {}

  get id() { return this.props.id }
  get name() { return this.props.name }
  get description() { return this.props.description }
  get location() { return this.props.location }

  static create(props: ProjectProps): Project {
    return new Project({ ...props })
  }

  toProps(): ProjectProps {
    return { ...this.props }
  }

  updateName(name: string): void {
    this.props.name = name
  }

  updateDescription(description: string | null): void {
    this.props.description = description
  }

  updateLocation(location: string | null): void {
    this.props.location = location
  }
}
