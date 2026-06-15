export interface ProjectProps {
  id: string
  name: string
}

export class Project {
  private constructor(private readonly props: ProjectProps) {}

  get id() { return this.props.id }
  get name() { return this.props.name }

  static create(props: ProjectProps): Project {
    return new Project({ ...props })
  }

  toProps(): ProjectProps {
    return { ...this.props }
  }
}
