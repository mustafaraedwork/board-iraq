import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ 
  className, 
  style,
  ...props 
}: React.ComponentProps<"div">) {
  const defaultStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#141413',
    border: 'none',
    ...style
  }

  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-6 rounded-xl py-6 shadow-sm border-0",
        className
      )}
      style={defaultStyle}
      {...props}
    />
  )
}

function CardHeader({ 
  className, 
  style,
  ...props 
}: React.ComponentProps<"div">) {
  const defaultStyle = {
    color: '#141413',
    ...style
  }

  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      style={defaultStyle}
      {...props}
    />
  )
}

function CardTitle({ 
  className, 
  style,
  ...props 
}: React.ComponentProps<"div">) {
  const defaultStyle = {
    color: '#141413',
    ...style
  }

  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      style={defaultStyle}
      {...props}
    />
  )
}

function CardDescription({ 
  className, 
  style,
  ...props 
}: React.ComponentProps<"div">) {
  const defaultStyle = {
    color: '#141413',
    opacity: 0.7,
    ...style
  }

  return (
    <div
      data-slot="card-description"
      className={cn("text-sm", className)}
      style={defaultStyle}
      {...props}
    />
  )
}

function CardAction({ 
  className, 
  style,
  ...props 
}: React.ComponentProps<"div">) {
  const defaultStyle = {
    color: '#141413',
    ...style
  }

  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      style={defaultStyle}
      {...props}
    />
  )
}

function CardContent({ 
  className, 
  style,
  ...props 
}: React.ComponentProps<"div">) {
  const defaultStyle = {
    color: '#141413',
    ...style
  }

  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      style={defaultStyle}
      {...props}
    />
  )
}

function CardFooter({ 
  className, 
  style,
  ...props 
}: React.ComponentProps<"div">) {
  const defaultStyle = {
    color: '#141413',
    ...style
  }

  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      style={defaultStyle}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}