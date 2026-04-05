import React from "react";
import { Lightbulb, Wrench, Printer, Component } from "lucide-react";
import { Text } from "@/components/Landing/text";

const steps = [
  {
    title: "Idea",
    subtitle: "Conceive Your Concept",
    description:
      "Imagine the shape, size, and mechanical movement of the wings you need for your cosplay project.",
    icon: Lightbulb,
  },
  {
    title: "Creation",
    subtitle: "Virtual Prototyping",
    description:
      "Use the configurator to recreate your vision. Build from scratch or edit a preset, and test angles.",
    icon: Component,
  },
  {
    title: "Printing",
    subtitle: "Physical Parts",
    description:
      "Consult the piece list needed for your build. Open Makerworld and start printing.",
    icon: Printer,
  },
  {
    title: "Assembly",
    subtitle: "Bring It To Life",
    description:
      "Connect the printed parts following your configuration to build the fully solid, posable mechanical base.",
    icon: Wrench,
  },
];

export default function HowToUse() {
  return (
    <section
      id="how-to-use"
      className="py-24 bg-white border-t border-slate-100"
    >
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="text-left mb-16">
          <Text as="h2" variant="h2" className="mb-6">
            The Creation{" "}
            <Text as="span" variant="accentItalic">
              Flow.
            </Text>
          </Text>
          <Text variant="body">
            The simple process from an idea to a fully functional base for your
            cosplay wings.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20 relative">
          {/* Subtle connecting line for desktop flow */}
          <div className="hidden lg:block absolute top-[24px] left-8 right-8 h-px bg-slate-200 -z-10" />

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col gap-8">
              <div className="flex items-center gap-5 border-b border-slate-200 pb-6 min-h-20">
                <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-xl shrink-0 z-10">
                  <step.icon size={26} strokeWidth={2} />
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <Text variant="role">STEP 0{index + 1}</Text>
                  <Text as="h3" variant="h3" className="text-2xl mt-0">
                    {step.title}
                  </Text>
                </div>
              </div>

              <Text variant="body" className="max-w-lg">
                {step.description}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
