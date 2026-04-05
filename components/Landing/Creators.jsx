import React from "react";
import { Coffee, Heart, Globe, ExternalLink } from "lucide-react";
import { Text } from "@/components/Landing/text";
import { Button } from "@/components/Landing/Button";

export default function Creators() {
  return (
    <section id="creators" className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="text-left mb-16">
          <Text as="h2" variant="h2" className="mb-6">
            The Minds Behind{" "}
            <Text as="span" variant="accentItalic">
              Icarus.
            </Text>
          </Text>
          <Text variant="body" className="max-w-2xl">
            A collaboration between technical development and artistic design.
          </Text>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
          {/* Greit - Dev */}
          <div className="flex flex-col gap-10">
            <div className="flex items-center gap-8 border-b border-slate-200 pb-10">
              <div className="w-24 h-24 bg-slate-900 rounded-4xl flex items-center justify-center font-black text-4xl text-white shadow-2xl">
                G
              </div>
              <div>
                <Text as="h3" variant="h3">
                  Greit.
                </Text>
                <Text variant="role" className="mt-2 text-xs">
                  Developer
                </Text>
              </div>
            </div>

            <Text variant="body" className="max-w-lg">
              Development of the web platform and implementation of the
              interactive 3D engine that powers the wing configurator.
            </Text>

            <div className="flex items-center gap-6">
              <Button
                href="https://ko-fi.com/R6R23OSRW"
                variant="primary"
                icon={Coffee}
              >
                Support the Dev
              </Button>
              <Button
                href="https://emanuelezini.com/"
                variant="secondary"
                icon={Globe}
              >
                Web Portfolio
              </Button>
            </div>
          </div>

          {/* Bzioo - Modeller */}
          <div className="flex flex-col gap-10">
            <div className="flex items-center gap-8 border-b border-slate-200 pb-10">
              <div className="w-24 h-24 bg-slate-100 rounded-4xl flex items-center justify-center font-black text-4xl text-slate-900 border border-slate-200">
                B
              </div>
              <div>
                <Text as="h3" variant="h3">
                  Bzioo.
                </Text>
                <Text variant="role" className="mt-2 text-xs">
                  3D Model Designer
                </Text>
              </div>
            </div>

            <Text variant="body" className="max-w-lg">
              Creation and sculpting of the 3D models, with a focus on designing
              the mechanical wing structures for the configurator.
            </Text>

            <div className="flex items-center gap-6">
              <Button
                href="https://patreon.com/cw/bzioo"
                variant="primary"
                icon={Heart}
              >
                Patreon
              </Button>
              <Button
                href="https://makerworld.com/it/@bzioo"
                variant="secondary"
                icon={ExternalLink}
              >
                Makerworld
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
