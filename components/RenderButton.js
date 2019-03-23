import React from 'react'
import Link from 'next/link'
import Button from '@material-ui/core/Button'

const linkStyle = {
  color: '#ffffff'
}

const ButtonLink = ({ className, href, hrefAs, children, prefetch }) => (
  <Link href={href} as={hrefAs} prefetch>
    <a 
      style={linkStyle}
      className={className}>

      {children}
    </a>
  </Link>
)

const RenderButton = props => (
  <Button 
    component={ButtonLink} 
    href={props.href}>
    {props.content}
  </Button>
)

export default RenderButton