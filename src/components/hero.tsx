"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable, InertiaPlugin, MotionPathPlugin } from "gsap/all";
gsap.registerPlugin(Draggable, InertiaPlugin, MotionPathPlugin);

import { Button } from "@/components/ui/button";

interface DishItem {
  name?: string;
  image?: string;
}

const dishes: DishItem[] = [
  { name: "Italian", image: "/dishes/italian.svg" },
  { name: "Mexican", image: "/dishes/mexican.svg" },
  { name: "Non veg", image: "/dishes/non-veg.svg" },
  { name: "North Indian", image: "/dishes/north-indian.svg" },
  { name: "Salad", image: "/dishes/salad.svg" },
  { name: "South Indian", image: "/dishes/south-indian.svg" },
  { name: "Italian", image: "/dishes/italian.svg" },
  { name: "Mexican", image: "/dishes/mexican.svg" },
  { name: "Non veg", image: "/dishes/non-veg.svg" },
  { name: "North Indian", image: "/dishes/north-indian.svg" },
];

export function Hero() {
  const [activeDish, setActiveDish] = useState(dishes[0]);

  // Refs to store references to dish plate elements and container
  const dishPlates = useRef<Array<HTMLDivElement | null>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP animation setup
  useGSAP(() => {
    /* make sure there are necessary elements to work with */
    if (!containerRef.current || dishPlates.current.length === 0) return;

    // calculate positions for circular arrangement
    const boxesAmount = dishes.length;
    const step = 360 / boxesAmount;
    let nextIndex = 0;

    // initialize positions of dish plates along the circular path
    gsap.set(dishPlates.current.filter(Boolean), {
      motionPath: {
        path: "#myPath",
        align: "#myPath",
        alignOrigin: [0.5, 0.5],
        start: -0.25,
        end: (i) => i / boxesAmount - 0.25,
        autoRotate: true,
      },
    });

    // draggable functionality for rotation (for mobile devices)
    Draggable.create(containerRef.current, {
      type: "rotation",
      inertia: true,

      /* add snapping effect */
      snap: (endVal) => {
        const snap = gsap.utils.snap(step, endVal);
        const modulus = snap % 360;
        nextIndex = Math.abs((modulus > 0 ? 360 - modulus : modulus) / step);
        return snap;
      },

      onDragEnd: () => {
        setActiveDish(dishes[nextIndex]);
      },
    });

    // create quick rotation animation function
    const rotateTo = gsap.quickTo(containerRef.current, "rotation", {
      duration: 0.5,
      ease: "power2.out",
    });

    // handle mouse wheel rotation
    const handleWheel = (event: WheelEvent) => {
      const sensitivity = 0.5;
      const currentRotation = gsap.getProperty(
        containerRef.current,
        "rotation",
      ) as number;
      const newRotation = currentRotation + event.deltaY * sensitivity;
      rotateTo(newRotation);

      // Calculate index manually to update activeDish
      const snapped = gsap.utils.snap(step, newRotation);
      const modulus = snapped % 360;
      const newIndex = Math.abs((modulus > 0 ? 360 - modulus : modulus) / step);
      setActiveDish(dishes[newIndex]);
    };

    // add wheel event listener
    document.addEventListener("wheel", handleWheel);

    // cleanup function
    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <section>
      <div className="relative mx-auto max-w-7xl overflow-hidden pt-92 lg:pt-74">
        {/* curve with slider clipping - low stacking context */}
        <div className="bg-primary absolute inset-0 z-10 [clip-path:circle(67.02%_at_51%_0px)] lg:[clip-path:circle(49%_at_63%_0px)]">
          {/* wheel of dishes  */}
          <div
            ref={containerRef}
            className="absolute inset-x-0 bottom-0 size-180 lg:right-0 lg:-bottom-80 lg:left-auto"
          >
            <svg viewBox="0 0 400 400">
              <path
                strokeWidth="2"
                stroke="currentColor"
                id="myPath"
                fill="none"
                d="M396,200 C396,308.24781 308.24781,396 200,396 91.75219,396 4,308.24781 4,200 4,91.75219 91.75219,4 200,4 308.24781,4 396,91.75219 396,200 z"
              ></path>
            </svg>

            {dishes?.map((dish, index) => (
              <Image
                key={index}
                ref={(el: HTMLDivElement | null) => {
                  dishPlates.current[index] = el;
                }}
                src={dish?.image || "/placeholder-image.svg"}
                alt={dish?.name || "Food dish"}
                width={113}
                height={113}
                className="absolute top-0 left-0 z-10 size-40"
              />
            ))}
          </div>
        </div>

        {/* container with content - high stacking context */}
        <div className="relative z-20 container grid items-end gap-8 lg:grid-cols-[2fr_3fr] lg:gap-30">
          {/* text box */}
          <div>
            <h1 className="grid gap-1 text-3xl sm:text-5xl">
              <span className="text-primary font-semibold">Delicious.</span>
              <span className="text-muted-foreground font-medium lg:text-4xl">
                One stop destination
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm sm:mt-6">
              Hunger pangs? You&apos;re at the right stop to drive it away!
              Order delicious food or reserve a table at your next cafe from the
              comfort of your home!
            </p>

            <p className="text-muted-foreground mt-10 text-2xl font-medium italic sm:mt-12 lg:mt-11 lg:text-3xl">
              One stop, Many routes
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button variant="outline">Book a table</Button>
              <Button size="lg">Order now!</Button>
            </div>
          </div>

          {/* current plate and slider controls */}
          <div className="-order-1 flex flex-col items-center lg:order-1">
            <Image
              src={activeDish.image || "/dishes/italian.svg"}
              alt="Dish plate"
              width={250}
              height={250}
              className="size-56"
            />
            <p className="bg-primary text-muted-foreground rounded-full px-16 py-3 text-xs font-medium">
              {activeDish.name}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
