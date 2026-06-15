export interface ProjectProps {
  id: string
  name: string
}

export class Project {
  private constructor(private props: ProjectProps) {}

  get id() { return this.props.id }
  get name() { return this.props.name }

  static create(props: ProjectProps): Project {
    return new Project({ ...props })
  }

  toProps(): ProjectProps {
    return { ...this.props }
  }

  updateName(name: string): void {
    this.props.name = name
  }
}
