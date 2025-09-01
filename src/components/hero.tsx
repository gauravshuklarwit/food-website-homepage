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
  color?: string;
}

const dishes: DishItem[] = [
  {
    name: "Italian cuisine",
    image: "/dishes/italian.svg",
    color: "#F45E5E",
  },
  { name: "Mexican cuisine", image: "/dishes/mexican.svg", color: "#FC9A63" },
  { name: "Non veg", image: "/dishes/non-veg.svg", color: "#f56e2e" },
  { name: "North Indian", image: "/dishes/north-indian.svg", color: "#94AC20" },
  { name: "Healthy Salads", image: "/dishes/salad.svg", color: "#93AE75" },
  {
    name: "South Indian Cuisine",
    image: "/dishes/south-indian.svg",
    color: "#F7D297",
  },
  { name: "Italian cuisine", image: "/dishes/italian.svg", color: "#F45E5E" },
  { name: "Mexican cuisine", image: "/dishes/mexican.svg", color: "#FC9A63" },
  { name: "Non veg", image: "/dishes/non-veg.svg", color: "#f56e2e" },
  { name: "North Indian", image: "/dishes/north-indian.svg", color: "#94AC20" },
];

export function Hero() {
  const [activeDishIndex, setActiveDishIndex] = useState(0);
  const activeDish = dishes[activeDishIndex];
  const currentPlate = useRef<HTMLImageElement>(null);

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
        setActiveDishIndex(nextIndex);
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
      setActiveDishIndex(newIndex);
    };

    gsap.fromTo(
      currentPlate.current,
      {
        opacity: 0,
        scale: 0,
      },
      {
        opacity: 1,
        scale: 1,
        ease: "circ.out",
        duration: 0.6,
      },
    );

    // add wheel event listener
    document.addEventListener("wheel", handleWheel);

    // cleanup function
    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, [activeDish, activeDishIndex]);

  const dynamicStyles: { [key: string]: string | number | undefined } = {
    "--primary": activeDish.color,
  };

  const handlePrevious = () => {
    setActiveDishIndex((prevIndex) =>
      prevIndex === 0 ? dishes.length - 1 : prevIndex - 1,
    );
  };
  const handleNext = () => {
    setActiveDishIndex((prevIndex) =>
      prevIndex === dishes.length - 1 ? 0 : prevIndex + 1,
    );
  };

  return (
    <section style={dynamicStyles}>
      <div className="relative mx-auto max-w-7xl overflow-hidden pt-92 lg:pt-74">
        {/* curve with slider clipping - low stacking context */}
        <div className="bg-primary absolute inset-0 z-10 [clip-path:circle(67.02%_at_51%_0px)] md:[clip-path:circle(55.10%_at_51%_0px)] lg:[clip-path:circle(48.19%_at_58.98%_7px)]">
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
              ref={currentPlate}
              src={activeDish?.image || "/dishes/italian.svg"}
              alt={activeDish?.name || "Dish plate"}
              width={250}
              height={250}
              className="size-56"
            />

            {/* controls */}
            <div className="mt-3 flex items-center justify-center">
              {/* left spoon */}
              <div className="flex items-center">
                <button
                  className="z-10 -mr-2 cursor-pointer"
                  onClick={handlePrevious}
                  aria-label="Previous"
                >
                  <Image
                    src="/vectors/left-spoon-container.svg"
                    alt="left spoon container"
                    width={56}
                    height={35}
                  />
                </button>
                <Image
                  src="/vectors/left-spoon-handle.svg"
                  alt="left spoon handle"
                  width={59}
                  height={8}
                />
              </div>
              {/* current dish label */}
              <span className="bg-primary grid h-9 w-54 place-items-center rounded-full px-8 transition duration-200">
                <p className="text-muted-foreground line-clamp-1 text-xs font-medium text-ellipsis">
                  {activeDish?.name}
                </p>
              </span>
              {/* right spoon */}
              <div className="flex items-center">
                <Image
                  src="/vectors/right-spoon-handle.svg"
                  alt="right spoon handle"
                  width={59}
                  height={8}
                />
                <button
                  className="z-10 -ml-2 cursor-pointer"
                  onClick={handleNext}
                  aria-label="Next"
                >
                  <Image
                    src="/vectors/right-spoon-container.svg"
                    alt="right spoon container"
                    width={56}
                    height={35}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
