<?php

namespace Diafat\Utils;

class Logger {
    private static $logFile = __DIR__ . '/../../logs/app.log';

    public static function info($message, $context = []) {
        self::log('INFO', $message, $context);
    }

    public static function warning($message, $context = []) {
        self::log('WARNING', $message, $context);
    }

    public static function error($message, $context = []) {
        self::log('ERROR', $message, $context);
    }

    private static function log($level, $message, $context = []) {
        $logDir = dirname(self::$logFile);
        if (!is_dir($logDir)) {
            mkdir($logDir, 0777, true);
        }

        $date = date('Y-m-d H:i:s');
        $contextString = !empty($context) ? json_encode($context) : '';
        $formattedMessage = "[$date] [$level]: $message $contextString" . PHP_EOL;

        file_put_contents(self::$logFile, $formattedMessage, FILE_APPEND);
    }
}
