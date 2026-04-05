import React from "react";
import { Text } from "@/components/Landing/text";
import Image from "next/image";

const presets = [
  {
    title: "Showcase",
    creator: "Bzioo",
    image: "/images/presets/Showcase.png",
  },
  {
    title: "Angel",
    creator: "Bzioo",
    image: "/images/presets/Angel.png",
  },
  {
    title: "Dragon",
    creator: "Bzioo",
    image: "/images/presets/Dragon.png",
  },
];

export default function Presets() {
  return (
    <section id="presets" className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="text-left">
            <Text as="h2" variant="h2" className="mb-6">
              Starting{" "}
              <Text as="span" variant="accentItalic">
                Presets.
              </Text>
            </Text>
            <Text variant="body">
              Jumpstart your build with community-favorite bases, ready for your
              custom edits.
            </Text>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-20">
          {presets.map((preset, index) => (
            <div key={index} className="flex flex-col gap-4">
              {/* Preset Image */}
              <div className="w-full aspect-square bg-slate-50 rounded-4xl overflow-hidden relative border border-slate-100">
                <Image
                  src={preset.image}
                  alt={preset.title}
                  width={1000}
                  height={1000}
                />
              </div>

              <div>
                <Text as="h3" variant="h3" className="font-black">
                  {preset.title}
                </Text>
                {preset.creator && (
                  <Text variant="role" className={"mt-1"}>
                    BY {preset.creator}
                  </Text>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
