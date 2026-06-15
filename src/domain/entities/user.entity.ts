export interface UserProps {
  id: string
  name: string
  email: string
  avatarUrl: string | null
}

export class User {
  private constructor(private props: UserProps) {}

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

  updateName(name: string): void {
    this.props.name = name
  }

  updateEmail(email: string): void {
    this.props.email = email
  }
}
