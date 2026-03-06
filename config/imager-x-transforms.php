<?php

return [
    'fullWebp' => [
        'displayName' => 'full width webp Image',
        'transforms' => [
            ['width' => 600],
            ['width' => 1024],
            ['width' => 1920],
        ],
        'defaults' => [
            'format' => 'webp',
            'webpQuality' => 80,
            'optimize' => true,
        ]
    ],
    'fullJpeg' => [
        'displayName' => 'full width webp Image',
        'transforms' => [
            ['width' => 600],
            ['width' => 1024],
            ['width' => 1920],
        ],
        'defaults' => [
            'format' => 'jpeg',
            'jpegQuality' => 80,
            'optimize' => true
        ]
    ],
    'fullPng' => [
        'displayName' => 'full width webp Image',
        'transforms' => [
            ['width' => 600],
            ['width' => 1024],
            ['width' => 1920],
        ],
        'defaults' => [
            'format' => 'png',
            'pngQuality' => 80,
            'optimize' => true
        ]
    ],
    'halfWebp' => [
        'displayName' => 'half width webp Image',
        'transforms' => [
            ['width' => 600],
            ['width' => 800],
        ],
        'defaults' => [
            'format' => 'webp',
            'webpQuality' => 80,
            'optimize' => true,
        ]
    ],
    'halfJpeg' => [
        'displayName' => 'half width Image',
        'transforms' => [
            ['width' => 600],
            ['width' => 800],
        ],
        'defaults' => [
            'format' => 'jpeg',
            'jpegQuality' => 80,
            'optimize' => true
        ]
    ],
    'halfPng' => [
        'displayName' => 'half width Image',
        'transforms' => [
            ['width' => 600],
            ['width' => 800],
        ],
        'defaults' => [
            'format' => 'png',
            'pngQuality' => 80,
            'optimize' => true
        ]
    ],
    'thirdWebp' => [
        'displayName' => 'third width Image',
        'transforms' => [
            ['width' => 600],
            ['width' => 900],
        ],
        'defaults' => [
            'format' => 'webp',
            'pngQuality' => 80,
            'optimize' => true
        ]
    ],
    'thirdJpeg' => [
        'displayName' => 'third width Image',
        'transforms' => [
            ['width' => 600],
            ['width' => 900],
        ],
        'defaults' => [
            'format' => 'jpeg',
            'jpegQuality' => 80,
            'optimize' => true
        ]
    ],
    'thirdPng' => [
        'displayName' => 'half width Image',
        'transforms' => [
            ['width' => 600],
            ['width' => 900],
        ],
        'defaults' => [
            'format' => 'png',
            'pngQuality' => 80,
            'optimize' => true
        ]
    ],
    'fourthWebp' => [
        'displayName' => 'half width webp Image',
        'transforms' => [
            ['width' => 400],
            ['width' => 600],
        ],
        'defaults' => [
            'format' => 'webp',
            'webpQuality' => 80,
            'optimize' => true,
        ]
    ],
    'fourthJpeg' => [
        'displayName' => 'half width Image',
        'transforms' => [
            ['width' => 400],
            ['width' => 600],
        ],
        'defaults' => [
            'format' => 'jpeg',
            'jpegQuality' => 80,
            'optimize' => true
        ]
    ],
    'fourthPng' => [
        'displayName' => 'half width webp Image',
        'transforms' => [
            ['width' => 400],
            ['width' => 600],
        ],
        'defaults' => [
            'format' => 'png',
            'webpQuality' => 80,
            'optimize' => true,
        ]
    ],
];