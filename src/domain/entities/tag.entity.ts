export interface TagProps {
  id: string
  name: string
  colorHex: string
}

export class Tag {
  private constructor(private readonly props: TagProps) {}

  get id() { return this.props.id }
  get name() { return this.props.name }
  get colorHex() { return this.props.colorHex }

  static create(props: TagProps): Tag {
    return new Tag({ ...props })
  }

  toProps(): TagProps {
    return { ...this.props }
  }
}
