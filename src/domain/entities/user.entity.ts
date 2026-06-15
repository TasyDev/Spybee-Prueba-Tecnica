export interface UserProps {
  id: string
  name: string
  email: string
  avatarUrl: string | null
}

export class User {
  private constructor(private readonly props: UserProps) {}

  get id() { return this.props.id }
  get name() { return this.props.name }
  get email() { return this.props.email }
  get avatarUrl() { return this.props.avatarUrl }

  static create(props: UserProps): User {
    return new User({ ...props })
  }

  toProps(): UserProps {
    return { ...this.props }
  }
}
