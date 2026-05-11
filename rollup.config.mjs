// rollup.config.mjs
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const isDev = process.env.ROLLUP_WATCH === 'true';

export default {
    input: 'src/ventosync-card.js',
    output: {
        file: 'dist/ventosync-card.js',
        format: 'es',
        sourcemap: isDev,
        banner: '/* VentoSync Card | MIT License | github.com/thomasengeroff-dotcom/ventosync-card */',
    },
    plugins: [
        resolve(),
        !isDev && terser({
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
            format: {
                comments: /^!/,
            },
        }),
    ],
};
