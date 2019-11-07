module.exports = {
  "Investor_Gains": {
    "repeat for inv in investments below": [{
      "x": 0,
      "y": 4,
      "v": {
        "value": "[inv.name]",
        "style": {
          "imeMode": 1,
          "parentName": "Standard 10"
        },
      }
    }, {
      "x": 1,
      "y": 4,
      "v": {
        "value": "[inv.participation_quote]",
        "style": {
          "formatter": "General",
          "imeMode": 1,
          "parentName": "Standard 10"
        },
      }
    }, {
      "x": 2,
      "y": 4,
      "v": {
        "value": "[inv.dividend_distribution]",
        "style": {
          "imeMode": 1,
          "parentName": "Standard 10"
        },
      }
    }, {
      "x": 3,
      "y": 4,
      "v": {
        "value": {
          "_calcError": "#NAME?",
          "_code": 29
        },
        "style": {
          "imeMode": 1,
          "parentName": "Standard 10"
        },
        "formula": "SUM(F5:OFFSET(F5,0,[investors.length]))"
      }
    }],
    "repeat for invr in investors to the right": [{
      "x": 4,
      "y": 1,
      "v": {
        "value": "[invr.name]",
        "style": {
          "imeMode": 1,
          "parentName": "Standard 10"
        },
      }
    }, {
      "x": 4,
      "y": 2,
      "v": {}
    }, {
      "x": 4,
      "y": 3,
      "v": {
        "value": "in%",
        "style": {
          "imeMode": 1,
          "parentName": "Standard 10"
        },
      }
    }], 
    "repeat for invr in investors to the right\nrepeat for inv in investments below": [{
      "x": 4,
      "y": 4,
      "v": {
        "value": {
          "_calcError": "#NAME?",
          "_code": 29
        },
        "style": {
          "themeFont": "Body",
          "imeMode": 1,
          "parentName": "Standard 10"
        },
        "formula": "$B5*[invr.commitment]"
      }
    }]
  }
}