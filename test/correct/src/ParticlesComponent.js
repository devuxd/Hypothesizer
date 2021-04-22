import Particles from 'react-particles-js'
import React from 'react'

function ParticlesComponent() {
    return (
        <div id="particles-js">
            <Particles
                params={{
                    "particles": {
                        "number": {
                            "value": 350,
                            "density": {
                                "enable": false
                            }
                        },
                        "size": {
                            "value": 9,
                            "random": true,
                            "anim": {
                                "speed": 6,
                                "size_min": 0.3
                            }
                        },
                        "line_linked": {
                            "enable": false
                        },
                        "move": {
                            "random": true,
                            "speed": 2,
                            "direction": "top",
                            "out_mode": "out"
                        },
                        "color": {
                            "value": ["#BD10E0","#B8E986","#50E3C2","#FFD300","#E86363"]
                        }
                    },
                    "interactivity": {
                        "events": {
                            "onhover": {
                                "enable": true,
                                "mode": "bubble"
                            },
                            "onclick": {
                                "enable": true,
                                "mode": "repulse"
                            }
                        },
                        "modes": {
                            "bubble": {
                                "distance": 100,
                                "duration": 2,
                                "size": 1,
                                "opacity": 0
                            },
                            "repulse": {
                                "distance": 250,
                                "duration": 4
                            }
                        }
                    }
                }} 
            />
        </div>
    )
}

export default ParticlesComponent;

//# sourceMappingURL=/src/ParticlesComponent.js.map