import { Injectable, Logger } from '@nestjs/common';
import { createCanvas, registerFont, Canvas, CanvasRenderingContext2D } from 'canvas';
import * as path from 'path';

// Gender-based color palettes
interface ColorPalette {
    primary: string;
    secondary: string;
    accent: string;
    background: string[];
    textMain: string;
    textSecondary: string;
    decorative: string;
}

interface DesignTheme {
    palette: ColorPalette;
    pattern: 'modern' | 'elegant' | 'playful';
}

@Injectable()
export class NameCardGeneratorService {
    private readonly logger = new Logger(NameCardGeneratorService.name);
    private readonly WIDTH = 800;
    private readonly HEIGHT = 400; // Compact image only
    private readonly PADDING = 50;

    constructor() {
        this.registerFonts();
    }

    /**
     * Font fayllarini ro'yxatdan o'tkazish
     */
    private registerFonts(): void {
        try {
            const fontsDir = path.join(process.cwd(), 'assets', 'fonts');
            const boldFont = path.join(fontsDir, 'Roboto-Bold.ttf');
            const regularFont = path.join(fontsDir, 'Roboto-Regular.ttf');

            // Check if files exist
            const fs = require('fs');
            if (fs.existsSync(boldFont) && fs.existsSync(regularFont)) {
                registerFont(boldFont, {
                    family: 'Roboto',
                    weight: 'bold',
                });
                registerFont(regularFont, {
                    family: 'Roboto',
                    weight: 'normal',
                });
                this.logger.log('✅ Custom fonts registered successfully');
            } else {
                this.logger.warn('⚠️ Font files not found, using system fonts');
            }
        } catch (error) {
            this.logger.warn('⚠️ Font registration failed, using system fonts:', error.message);
        }
    }

    /**
     * Gender-based dizayn temalari - kreativ va jozibali ranglar
     */
    private getDesignTheme(gender?: 'boy' | 'girl'): DesignTheme {
        const themes = {
            boy: {
                palette: {
                    primary: '#2563eb', // Chuqur ko'k
                    secondary: '#3b82f6',
                    accent: '#1e40af',
                    background: ['#0f172a', '#1e3a8a', '#2563eb', '#60a5fa', '#dbeafe', '#f0f9ff'],
                    textMain: '#0f172a',
                    textSecondary: '#334155',
                    decorative: 'rgba(37, 99, 235, 0.15)',
                },
                pattern: 'modern' as const,
            },
            girl: {
                palette: {
                    primary: '#db2777', // Yorqin pushti
                    secondary: '#ec4899',
                    accent: '#be185d',
                    background: ['#4a044e', '#831843', '#db2777', '#f472b6', '#fbcfe8', '#fdf2f8'],
                    textMain: '#1f0c24',
                    textSecondary: '#4a1d4e',
                    decorative: 'rgba(219, 39, 119, 0.15)',
                },
                pattern: 'elegant' as const,
            },
            neutral: {
                palette: {
                    primary: '#7c3aed', // Quyuq binafsha
                    secondary: '#8b5cf6',
                    accent: '#6d28d9',
                    background: ['#1e1b4b', '#4c1d95', '#7c3aed', '#a78bfa', '#ddd6fe', '#f5f3ff'],
                    textMain: '#1e1b4b',
                    textSecondary: '#4c1d95',
                    decorative: 'rgba(124, 58, 237, 0.15)',
                },
                pattern: 'playful' as const,
            },
        };

        return themes[gender || 'neutral'];
    }

    /**
     * Ism ma'nosi uchun kreativ navogodniy rasm generatsiya qiladi
     */
    async generateNameCard(
        name: string,
        meaning: string,
        gender?: 'boy' | 'girl',
    ): Promise<Buffer> {
        const canvas = createCanvas(this.WIDTH, this.HEIGHT);
        const ctx = canvas.getContext('2d');
        const theme = this.getDesignTheme(gender);

        // Chiroyli gradient background
        this.drawCreativeBackground(ctx, theme);

        // Yangi yil elementlari - qor, yulduzlar, konfeti
        this.drawNewYearElements(ctx, theme);

        // Geometrik pattern va naqshlar
        this.drawGeometricPattern(ctx, theme);

        // Corner light effects
        this.drawLightEffects(ctx, theme.palette.accent);

        // Markazda chiroyli doira effect
        this.drawCenterGlow(ctx, theme);

        return canvas.toBuffer('image/png');
    }

    /**
     * Kreativ gradient background - ko'p qatlamli va chiroyli
     */
    private drawCreativeBackground(ctx: CanvasRenderingContext2D, theme: DesignTheme): void {
        const { background, primary, secondary } = theme.palette;

        // Dark base
        ctx.fillStyle = background[0];
        ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

        // Ko'p markazli radial gradient - 3D effekt
        const gradients = [
            { x: this.WIDTH * 0.3, y: this.HEIGHT * 0.3, r: 300, colors: [primary + '60', secondary + '40', 'transparent'] },
            { x: this.WIDTH * 0.7, y: this.HEIGHT * 0.7, r: 350, colors: [secondary + '50', primary + '30', 'transparent'] },
            { x: this.WIDTH * 0.5, y: this.HEIGHT * 0.5, r: 250, colors: [background[4] + '80', background[3] + '40', 'transparent'] },
        ];

        gradients.forEach(g => {
            const gradient = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
            g.colors.forEach((color, i) => {
                gradient.addColorStop(i / (g.colors.length - 1), color);
            });
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
        });

        // Diagonal light streaks
        for (let i = 0; i < 5; i++) {
            const gradient = ctx.createLinearGradient(
                i * 200 - 100, 0,
                i * 200 + 100, this.HEIGHT
            );
            gradient.addColorStop(0, 'transparent');
            gradient.addColorStop(0.5, background[4] + '20');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
        }
    }

    /**
     * Yangi yil elementlari - qor, yulduzlar, konfeti
     */
    private drawNewYearElements(ctx: CanvasRenderingContext2D, theme: DesignTheme): void {
        const { accent, primary, secondary } = theme.palette;
        const random = (seed: number) => (Math.sin(seed * 12.9898 + 78.233) * 43758.5453) % 1;

        // Qor parchalari - turli o'lchamdagi doiralar
        for (let i = 0; i < 50; i++) {
            const x = random(i * 1.5) * this.WIDTH;
            const y = random(i * 2.3) * this.HEIGHT;
            const size = random(i * 3.7) * 4 + 2;
            const opacity = random(i * 5.1) * 0.6 + 0.3;

            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();

            // Chiroyli glow effect
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(x, y, size - 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        // Konfeti - rangli chiziqlar
        for (let i = 0; i < 30; i++) {
            const x = random(i * 4.2) * this.WIDTH;
            const y = random(i * 5.6) * this.HEIGHT;
            const angle = random(i * 6.8) * Math.PI * 2;
            const length = random(i * 7.9) * 20 + 10;
            const colors = [primary, secondary, accent];
            const color = colors[Math.floor(random(i * 9.3) * colors.length)];

            ctx.strokeStyle = color + '80';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
            ctx.stroke();
        }

        // Yulduzlar - 5 qirrali
        for (let i = 0; i < 20; i++) {
            const x = random(i * 8.1) * this.WIDTH;
            const y = random(i * 9.4) * this.HEIGHT;
            const size = random(i * 10.7) * 8 + 5;
            const rotation = random(i * 11.2) * Math.PI * 2;

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);

            // Gradient yulduz
            const starGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
            starGradient.addColorStop(0, accent);
            starGradient.addColorStop(1, accent + '40');
            ctx.fillStyle = starGradient;

            ctx.beginPath();
            for (let j = 0; j < 5; j++) {
                const angle = (j * 4 * Math.PI) / 5 - Math.PI / 2;
                const px = Math.cos(angle) * size;
                const py = Math.sin(angle) * size;
                if (j === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }
    }

    /**
     * Geometrik pattern - chiroyli naqshlar
     */
    private drawGeometricPattern(ctx: CanvasRenderingContext2D, theme: DesignTheme): void {
        const { decorative, accent, primary } = theme.palette;

        // Doiralar - konsentrik
        for (let i = 0; i < 8; i++) {
            const x = (this.WIDTH / 8) * i + 50;
            const y = this.HEIGHT * 0.3;
            const radius = 40 + i * 5;

            ctx.strokeStyle = decorative;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Pastda ham doiralar
        for (let i = 0; i < 8; i++) {
            const x = (this.WIDTH / 8) * i + 50;
            const y = this.HEIGHT * 0.7;
            const radius = 35 + i * 4;

            ctx.strokeStyle = decorative;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Zig-zag lines - dinamik
        ctx.strokeStyle = accent + '30';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x < this.WIDTH; x += 40) {
            const y = this.HEIGHT / 2 + Math.sin(x / 30) * 50;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Poligonlar - random
        const random = (seed: number) => (Math.sin(seed * 12.9898) * 43758.5453) % 1;
        for (let i = 0; i < 10; i++) {
            const x = random(i * 2.1) * this.WIDTH;
            const y = random(i * 3.4) * this.HEIGHT;
            const sides = 5 + Math.floor(random(i * 4.7) * 3);
            const size = 20 + random(i * 5.3) * 30;

            ctx.strokeStyle = primary + '40';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let j = 0; j < sides; j++) {
                const angle = (j / sides) * Math.PI * 2;
                const px = x + Math.cos(angle) * size;
                const py = y + Math.sin(angle) * size;
                if (j === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();
        }
    }

    /**
     * Yorug'lik effektlari - burchaklarda va chekkalarda
     */
    private drawLightEffects(ctx: CanvasRenderingContext2D, color: string): void {
        // Burchaklarda katta glow
        const corners = [
            { x: 0, y: 0, r: 180 },
            { x: this.WIDTH, y: 0, r: 180 },
            { x: 0, y: this.HEIGHT, r: 150 },
            { x: this.WIDTH, y: this.HEIGHT, r: 150 },
        ];

        corners.forEach(corner => {
            const gradient = ctx.createRadialGradient(corner.x, corner.y, 0, corner.x, corner.y, corner.r);
            gradient.addColorStop(0, color + '60');
            gradient.addColorStop(0.3, color + '30');
            gradient.addColorStop(0.6, color + '10');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
        });

        // Chekkalarda light rays
        for (let i = 0; i < 4; i++) {
            const x = (this.WIDTH / 4) * i + this.WIDTH / 8;
            const gradient = ctx.createLinearGradient(x - 30, 0, x + 30, this.HEIGHT);
            gradient.addColorStop(0, color + '20');
            gradient.addColorStop(0.5, 'transparent');
            gradient.addColorStop(1, color + '20');
            ctx.fillStyle = gradient;
            ctx.fillRect(x - 30, 0, 60, this.HEIGHT);
        }
    }

    /**
     * Markazda chiroyli doira glow effekt
     */
    private drawCenterGlow(ctx: CanvasRenderingContext2D, theme: DesignTheme): void {
        const { primary, secondary, accent } = theme.palette;
        const centerX = this.WIDTH / 2;
        const centerY = this.HEIGHT / 2;

        // Katta markaziy glow - 3 qatlam
        const glows = [
            { r: 200, color: primary + '40' },
            { r: 150, color: secondary + '50' },
            { r: 100, color: accent + '60' },
        ];

        glows.forEach(glow => {
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glow.r);
            gradient.addColorStop(0, glow.color);
            gradient.addColorStop(0.5, glow.color.replace(/[\d.]+\)/, '20)'));
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
        });

        // Pulse rings - aylanuvchi halqalar
        for (let i = 0; i < 5; i++) {
            const radius = 80 + i * 25;
            const gradient = ctx.createRadialGradient(centerX, centerY, radius - 5, centerX, centerY, radius + 5);
            gradient.addColorStop(0, 'transparent');
            gradient.addColorStop(0.5, accent + '40');
            gradient.addColorStop(1, 'transparent');

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    private drawCornerAccents(ctx: CanvasRenderingContext2D, color: string): void {
        // Top left - layered accent
        const gradient1 = ctx.createRadialGradient(0, 0, 0, 0, 0, 120);
        gradient1.addColorStop(0, color + '40');
        gradient1.addColorStop(0.5, color + '20');
        gradient1.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient1;
        ctx.beginPath();
        ctx.arc(0, 0, 120, 0, Math.PI / 2);
        ctx.lineTo(0, 0);
        ctx.fill();

        // Top right - layered accent
        const gradient2 = ctx.createRadialGradient(this.WIDTH, 0, 0, this.WIDTH, 0, 120);
        gradient2.addColorStop(0, color + '40');
        gradient2.addColorStop(0.5, color + '20');
        gradient2.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient2;
        ctx.beginPath();
        ctx.arc(this.WIDTH, 0, 120, Math.PI / 2, Math.PI);
        ctx.lineTo(this.WIDTH, 0);
        ctx.fill();

        // Bottom corners - subtle glow
        const gradient3 = ctx.createRadialGradient(0, this.HEIGHT, 0, 0, this.HEIGHT, 80);
        gradient3.addColorStop(0, color + '25');
        gradient3.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient3;
        ctx.beginPath();
        ctx.arc(0, this.HEIGHT, 80, 0, Math.PI * 2);
        ctx.fill();

        const gradient4 = ctx.createRadialGradient(this.WIDTH, this.HEIGHT, 0, this.WIDTH, this.HEIGHT, 80);
        gradient4.addColorStop(0, color + '25');
        gradient4.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient4;
        ctx.beginPath();
        ctx.arc(this.WIDTH, this.HEIGHT, 80, 0, Math.PI * 2);
        ctx.fill();
    }
}
