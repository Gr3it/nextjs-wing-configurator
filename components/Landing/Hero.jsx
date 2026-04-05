import React from "react";
import Image from "next/image";
import { Button } from "@/components/Landing/Button";
import { ArrowRight, Monitor } from "lucide-react";
import { Text } from "@/components/Landing/text";

export default function Hero() {
  return (
    <section className="relative min-h-[95vh] flex flex-col justify-center pt-32 pb-20 bg-white overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 items-center">
          <div className="relative z-10">
            <Text as="h1" variant="h1" className="mb-8">
              Icarus.
              <Text as="span" variant="accentTitle">
                Cosplay Wing Configurator
              </Text>
            </Text>

            <Text variant="body" className="max-w-xl mb-12">
              Design your perfect wing skeleton with professional precision.
              ICARUS lets you create, pose, and visualize your custom wing sets
              before you ever touch a printer.
            </Text>

            <div className="flex flex-col sm:flex-row items-start gap-6">
              <Button
                href="/app"
                size="xl"
                rightIcon={ArrowRight}
                className="shadow-2xl shadow-slate-200"
              >
                Open Configurator
              </Button>
            </div>
          </div>

          <div className="relative flex justify-center items-center h-[80vh]">
            <Image
              src="/hero.png"
              alt="ICARUS Wing Configurator Mannequin"
              width={6000}
              height={4500}
              priority
              className="h-full w-auto max-w-none"
            />
          </div>
        </div>
      </div>

      {/* Decorative background element */}
      <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-slate-50 rounded-full blur-[100px] -z-10 opacity-60" />
    </section>
  );
}
