import { Stepper } from "@mantine/core";
import { forwardRef, ForwardRefRenderFunction } from "react";
import { useImperativeHandle } from "react";
import { useState } from "react";

type StepperProps = {};

export type StepperHandle = {
  nextStep: () => void;
  backStep: () => void;
  setStep: (step: number) => void;
};

const AppStepper: ForwardRefRenderFunction<StepperHandle, StepperProps> = (
  props,
  ref
) => {
  const [active, setActive] = useState(0);

  const nextStep = () =>
    setActive((current) => (current < 4 ? current + 1 : current));
  const backStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const setStep = (step: number) => setActive(step);

  useImperativeHandle(ref, () => ({
    nextStep,
    backStep,
    setStep,
  }));

  return (
    <Stepper
      active={active}
      orientation="horizontal"
      mb="xl"
      mt="sm"
      size="sm"
      breakpoint="xs"
    >
      <Stepper.Step label="Review" description="Compartilhe sua opinião" />
      <Stepper.Step label="Fotos" description="Adicione fotos" />
      <Stepper.Step label="Vídeo" description="Adicione vídeo" />
    </Stepper>
  );
};

export default forwardRef(AppStepper);
