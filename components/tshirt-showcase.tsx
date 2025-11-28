import Image from "next/image"

export function TshirtShowcase() {
  return (
    <div className="relative">
      {/* Main T-shirt Image */}
      <div className="relative aspect-square max-w-md mx-auto">
        <Image
          src="/images/image.png"
          alt="Kaos MBAH SOETA FAMILY - tampilan dari berbagai sudut"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-4 -left-4 w-24 h-24 border-l-2 border-t-2 border-primary/30 rounded-tl-3xl" />
      <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-primary/30 rounded-br-3xl" />
    </div>
  )
}
