import { FontSize } from './font-size.enum'

export interface SatoriPreset {
    width: number,
    height: number,
}

export interface Svg2PngPreset {
    value: number
}

export interface Preset {
    satori: SatoriPreset,
    font: FontSize,
    svg2png: Svg2PngPreset,
    name: string
}

export class LowResPreset implements Preset {
    get name() {
        return '240p'
    }

    get satori() {
        return {
            width: 426,
            height: 240,
        }
    }

    get font() {
        return FontSize.ExtraSmall
    }

    get svg2png() {
        return {
            value: 426
        }
    }
}

export class MediumResPreset implements Preset {
    get name() {
        return '480p'
    }

    get satori() {
        return {
            width: 854,
            height: 480,
        }
    }

    get font() {
        return FontSize.Small
    }

    get svg2png() {
        return {
            value: 854
        }
    }
}

export class HighResPreset implements Preset {
    get name() {
        return '720p'
    }

    get satori() {
        return {
            width: 1280,
            height: 720,
        }
    }

    get font() {
        return FontSize.Medium
    }

    get svg2png() {
        return {
            value: 1280
        }
    }
}

export class UltraResPreset implements Preset {
    get name() {
        return '1080p'
    }

    get satori() {
        return {
            width: 1920,
            height: 1080,
        }
    }

    get font() {
        return FontSize.Large
    }

    get svg2png() {
        return {
            value: 1920
        }
    }
}

export class MaxResPreset implements Preset {
    get name() {
        return '4k'
    }

    get satori() {
        return {
            width: 3840,
            height: 2160,
        }
    }

    get font() {
        return FontSize.ExtraLarge
    }

    get svg2png() {
        return {
            value: 3840
        }
    }
}
