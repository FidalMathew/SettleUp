"use client";

import * as React from "react";

import {cn} from "@/lib/utils";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface BaseProps {
  children: React.ReactNode;
}

interface RootResponsiveDialogComponentProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface ResponsiveDialogProps extends BaseProps {
  className?: string;
  asChild?: true;
}

const desktop = "(min-width: 768px)";

const ResponsiveDialogComponent = ({
  children,
  ...props
}: RootResponsiveDialogComponentProps) => {
  const isDesktop = useMediaQuery(desktop);
  const ResponsiveDialogComponent = isDesktop ? Dialog : Drawer;

  return (
    <ResponsiveDialogComponent {...props}>{children}</ResponsiveDialogComponent>
  );
};

const ResponsiveDialogComponentTrigger = ({
  className,
  children,
  ...props
}: ResponsiveDialogProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaTrigger = isDesktop ? DialogTrigger : DrawerTrigger;

  return (
    <CredenzaTrigger className={className} {...props}>
      {children}
    </CredenzaTrigger>
  );
};

const ResponsiveDialogComponentClose = ({
  className,
  children,
  ...props
}: ResponsiveDialogProps) => {
  const isDesktop = useMediaQuery(desktop);
  const ResponsiveDialogComponentClose = isDesktop ? DialogClose : DrawerClose;

  return (
    <ResponsiveDialogComponentClose className={className} {...props}>
      {children}
    </ResponsiveDialogComponentClose>
  );
};

const ResponsiveDialogComponentContent = ({
  className,
  children,
  ...props
}: ResponsiveDialogProps) => {
  const isDesktop = useMediaQuery(desktop);
  const ResponsiveDialogComponentContent = isDesktop
    ? DialogContent
    : DrawerContent;

  return (
    <ResponsiveDialogComponentContent className={className} {...props}>
      {children}
    </ResponsiveDialogComponentContent>
  );
};

const ResponsiveDialogComponentDescription = ({
  className,
  children,
  ...props
}: ResponsiveDialogProps) => {
  const isDesktop = useMediaQuery(desktop);
  const ResponsiveDialogComponentDescription = isDesktop
    ? DialogDescription
    : DrawerDescription;

  return (
    <ResponsiveDialogComponentDescription className={className} {...props}>
      {children}
    </ResponsiveDialogComponentDescription>
  );
};

const ResponsiveDialogComponentHeader = ({
  className,
  children,
  ...props
}: ResponsiveDialogProps) => {
  const isDesktop = useMediaQuery(desktop);
  const ResponsiveDialogComponentHeader = isDesktop
    ? DialogHeader
    : DrawerHeader;

  return (
    <ResponsiveDialogComponentHeader className={className} {...props}>
      {children}
    </ResponsiveDialogComponentHeader>
  );
};

const ResponsiveDialogComponentTitle = ({
  className,
  children,
  ...props
}: ResponsiveDialogProps) => {
  const isDesktop = useMediaQuery(desktop);
  const ResponsiveDialogComponentTitle = isDesktop ? DialogTitle : DrawerTitle;

  return (
    <ResponsiveDialogComponentTitle className={className} {...props}>
      {children}
    </ResponsiveDialogComponentTitle>
  );
};

const ResponsiveDialogComponentBody = ({
  className,
  children,
  ...props
}: ResponsiveDialogProps) => {
  return (
    <div className={cn("px-4 md:px-0", className)} {...props}>
      {children}
    </div>
  );
};

const ResponsiveDialogComponentFooter = ({
  className,
  children,
  ...props
}: ResponsiveDialogProps) => {
  const isDesktop = useMediaQuery(desktop);
  const ResponsiveDialogComponentFooter = isDesktop
    ? DialogFooter
    : DrawerFooter;

  return (
    <ResponsiveDialogComponentFooter className={className} {...props}>
      {children}
    </ResponsiveDialogComponentFooter>
  );
};

export {
  ResponsiveDialogComponent,
  ResponsiveDialogComponentTrigger,
  ResponsiveDialogComponentClose,
  ResponsiveDialogComponentContent,
  ResponsiveDialogComponentDescription,
  ResponsiveDialogComponentHeader,
  ResponsiveDialogComponentTitle,
  ResponsiveDialogComponentBody,
  ResponsiveDialogComponentFooter,
};
