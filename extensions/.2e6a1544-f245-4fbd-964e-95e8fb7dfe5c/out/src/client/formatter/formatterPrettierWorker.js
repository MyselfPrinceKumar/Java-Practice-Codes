const { parentPort } = require('worker_threads');

parentPort.on('message', async (task) => {
    try {
        // Dynamically import prettier and the plugin
        const prettier = require(task.prettierPath);
        const pluginPath = require(task.pluginPath);

        // Resolve config
        const config = await prettier.resolveConfig(task.documentPath);
        //keeping this for now, 
        //but it's not needed as we are terminating the worker after each request

        if (config !== null) {
            await prettier.clearConfigCache();
        }

        // Merge user config with default options
        const options = { ...task.options, ...config, plugins: [pluginPath] };
        const formatted = await prettier.format(task.source, options);

        parentPort.postMessage({ success: true, formatted });
    } catch (error) {
         parentPort.postMessage({ success: false, error: error.message });
    }
});