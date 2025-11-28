import Image from "next/image"

export function TshirtShowcase() {
  return (
    <div className="relative">
      {/* Main T-shirt Image */}
      <div className="relative aspect-square max-w-sm sm:max-w-md mx-auto">
        <Image
          src="/images/image.png"
          alt="Kaos MBAH SOETA FAMILY - tampilan dari berbagai sudut"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 w-16 h-16 sm:w-24 sm:h-24 border-l-2 border-t-2 border-primary/30 rounded-tl-2xl sm:rounded-tl-3xl" />
      <div className="absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 w-16 h-16 sm:w-24 sm:h-24 border-r-2 border-b-2 border-primary/30 rounded-br-2xl sm:rounded-br-3xl" />
    </div>
  )
}
