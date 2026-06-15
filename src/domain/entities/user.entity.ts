export interface UserProps {
  id: string
  name: string
  email: string
  role: string | null
  avatarUrl: string | null
}

export class User {
  private constructor(private props: UserProps) {}

  get id() { return this.props.id }
  get name() { return this.props.name }
  get email() { return this.props.email }
  get role() { return this.props.role }
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

  updateRole(role: string | null): void {
    this.props.role = role
  }
}
