const formatMessage = require('format-message');
const nets = require('nets');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

/**
 * Icon svg to be displayed in the blocks category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjMsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i44Os44Kk44Ok44O8XzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCINCgkgeT0iMHB4IiB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQwIDQwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjAuMTI7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDF7ZmlsbDojOTk5OTk5O30NCgkuc3Qye2ZpbGw6I0RCODUwOTt9DQoJLnN0M3tmaWxsOiNGQ0MyNUI7fQ0KCS5zdDR7ZmlsbDojMUExQTFBO30NCgkuc3Q1e2ZpbGw6IzAwRkYwMDt9DQoJLnN0NntmaWxsOiNGMkYyRjI7fQ0KCS5zdDd7ZmlsbDojQjNCM0IzO30NCgkuc3Q4e2ZpbGw6IzI0MjQyNDt9DQoJLnN0OXtmaWxsOiNGRkY2RDI7fQ0KCS5zdDEwe2ZpbGw6I0FGOUM0QTt9DQoJLnN0MTF7ZmlsbDojRkZGRkZGO30NCgkuc3QxMntmaWxsOiM0QjRCNEI7fQ0KCS5zdDEze2ZpbGw6I0NDQ0NDQzt9DQoJLnN0MTR7ZmlsbDojMzMzMzMzO30NCgkuc3QxNXtmaWxsOiNGRjAwMzM7fQ0KCS5zdDE2e2ZpbGw6I0ZGREM0ODt9DQoJLnN0MTd7ZmlsbDojNjY2NjY2O30NCgkuc3QxOHtmaWxsOiM0RDRENEQ7fQ0KCS5zdDE5e2ZpbGw6IzAwMDBGRjt9DQoJLnN0MjB7ZmlsbDojRTZFNkU2O30NCgkuc3QyMXtmaWxsOiMwMEZGRkY7fQ0KPC9zdHlsZT4NCjxnPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTcuNCwxNS4xbC0zLTJjLTEtMC43LTIuMi0xLjEtMy40LTEuMWMtMy40LDAtNi4xLDIuNy02LjEsNi4xYzAsMiwxLDMuOCwyLjUsNC45bDIuOSwyLjFsMC43LTAuOQ0KCQkJYzMuNCwwLDYuMS0yLjcsNi4xLTYuMWMwLTAuNy0wLjEtMS40LTAuNC0yLjFMMTcuNCwxNS4xeiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggZD0iTTEzLjksMTMuOWMtMy40LDAtNi4yLDIuOC02LjIsNi4yYzAsMy40LDIuOCw2LjIsNi4yLDYuMmMzLjQsMCw2LjItMi44LDYuMi02LjJDMjAuMSwxNi43LDE3LjMsMTMuOSwxMy45LDEzLjl6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOSwyMy45Yy0wLjYtMS0xLjItMi40LTEuMi0zLjZjMC0zLjQsMi43LTYuMiw2LjItNi4yYzAuOCwwLDEuNywwLjEsMi40LDAuNGwtMC4yLTAuMQ0KCQkJYy0wLjctMC4zLTEuNi0wLjUtMi40LTAuNWMtMy40LDAtNi4yLDIuOC02LjIsNi4yYzAsMS4zLDAuNSwyLjYsMS4xLDMuNkw5LDIzLjl6Ii8+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNi4yLDE0LjQiLz4NCgk8L2c+DQo8L2c+DQo8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTQuOCwyNy4zbDIxLjktNi43bDIuNC0wLjdjMC0wLjEsMC0xLjIsMC0xLjNjLTAuMi0xLjEtMS41LTIuNC0zLjYtMy44Yy0yLjItMS41LTQuOS0yLjctNy4xLTMuMmwtMi40LDAuNw0KCUw0LDE5TDE0LjgsMjcuM3oiLz4NCjxwYXRoIGNsYXNzPSJzdDMiIGQ9Ik0xNC43LDI2bDIxLjktNi43bDIuNC0wLjdjLTAuMS0xLjItMS40LTIuNy0zLjYtNC4zcy00LjktMi43LTcuMS0zLjJsLTIuNCwwLjdMNCwxOC41TDE0LjcsMjZ6Ii8+DQo8cGF0aCBjbGFzcz0ic3Q0IiBkPSJNMzUuMSwxNS43YzAtMC4yLTAuMi0wLjUtMC40LTAuN2wtNS0zLjRjLTAuMi0wLjEtMC41LDAtMC41LDAuMmMwLDAsMCwwLjQsMCwwLjRsMCwxLjFsNS45LDQuMUwzNS4xLDE1LjcNCglMMzUuMSwxNS43eiIvPg0KPHBhdGggY2xhc3M9InN0NCIgZD0iTTI5LjQsMTEuOWMtMC4xLTAuMS0wLjItMC4yLTAuNC0wLjJsLTYsMS45Yy0wLjIsMC4xLTAuMywwLjItMC40LDAuNGwwLDAuMmMwLDAsMCwwLDAsMGwwLDAuM2MwLDAsMCwwLDAsMA0KCWwwLDAuN2w2LjgtMi4yTDI5LjQsMTEuOXoiLz4NCjxwb2x5Z29uIGNsYXNzPSJzdDQiIHBvaW50cz0iMzQuOSwxNi4yIDI4LDE4LjQgMjIuNiwxNC42IDI5LjUsMTIuNCAiLz4NCjxwYXRoIGNsYXNzPSJzdDUiIGQ9Ik0yNC4xLDE1LjdjMCwwLDYtMS45LDYuMS0yYzAuMy0wLjQsMC4zLTEtMC4xLTEuM2MtMC4yLTAuMi0wLjUtMC4yLTAuOC0wLjJMMjMuNiwxNGwwLDAuMg0KCWMtMC4zLDAuNC0wLjMsMSwwLjEsMS4zYzAuMSwwLjEsMC4yLDAuMSwwLjMsMC4yTDI0LjEsMTUuN3oiLz4NCjxlbGxpcHNlIHRyYW5zZm9ybT0ibWF0cml4KDAuNjM4NiAtMC43Njk2IDAuNzY5NiAwLjYzODYgLTIuODE0NSAyMy43MzYpIiBjbGFzcz0ic3Q1IiBjeD0iMjMuOSIgY3k9IjE0LjkiIHJ4PSIwLjkiIHJ5PSIwLjkiLz4NCjxnPg0KCTxwYXRoIGNsYXNzPSJzdDYiIGQ9Ik0yMy45LDE1LjZjLTAuMiwwLTAuMy0wLjEtMC41LTAuMmMtMC4xLTAuMS0wLjItMC4zLTAuMy0wLjVjMC0wLjIsMC0wLjQsMC4yLTAuNWMwLjEtMC4yLDAuMy0wLjMsMC42LTAuMw0KCQljMC4yLDAsMC4zLDAuMSwwLjUsMC4yYzAuMSwwLjEsMC4yLDAuMywwLjMsMC41YzAsMC4yLDAsMC40LTAuMiwwLjVDMjQuMywxNS41LDI0LjEsMTUuNiwyMy45LDE1LjZ6Ii8+DQo8L2c+DQo8cGF0aCBjbGFzcz0ic3Q1IiBkPSJNMjUuNSwxNi42YzAsMCw2LTEuOSw2LjEtMmMwLjMtMC40LDAuMy0xLTAuMS0xLjNjLTAuMi0wLjItMC41LTAuMi0wLjgtMC4yTDI1LDE0LjlsMCwwLjINCgljLTAuMywwLjQtMC4zLDEsMC4xLDEuM2MwLjEsMC4xLDAuMiwwLjEsMC4zLDAuMkwyNS41LDE2LjZ6Ii8+DQo8ZWxsaXBzZSB0cmFuc2Zvcm09Im1hdHJpeCgwLjYzODYgLTAuNzY5NiAwLjc2OTYgMC42Mzg2IC0zLjAwNDggMjUuMTMxOCkiIGNsYXNzPSJzdDUiIGN4PSIyNS4zIiBjeT0iMTUuOCIgcng9IjAuOSIgcnk9IjAuOSIvPg0KPGc+DQoJPHBhdGggY2xhc3M9InN0NiIgZD0iTTI1LjIsMTYuNWMtMC4yLDAtMC4zLTAuMS0wLjUtMC4yYy0wLjMtMC4zLTAuMy0wLjctMC4xLTFjMC4xLTAuMiwwLjMtMC4zLDAuNi0wLjNjMC4yLDAsMC4zLDAuMSwwLjUsMC4yDQoJCWMwLjEsMC4xLDAuMiwwLjMsMC4zLDAuNWMwLDAuMiwwLDAuNC0wLjIsMC41QzI1LjcsMTYuNCwyNS41LDE2LjUsMjUuMiwxNi41eiIvPg0KPC9nPg0KPHBhdGggY2xhc3M9InN0NSIgZD0iTTI2LjksMTcuNWMwLDAsNi0xLjksNi4xLTJjMC4zLTAuNCwwLjMtMS0wLjEtMS4zYy0wLjItMC4yLTAuNS0wLjItMC44LTAuMmwtNS43LDEuN2wwLDAuMg0KCWMtMC4zLDAuNC0wLjMsMSwwLjEsMS4zYzAuMSwwLjEsMC4yLDAuMSwwLjMsMC4yTDI2LjksMTcuNXoiLz4NCjxlbGxpcHNlIHRyYW5zZm9ybT0ibWF0cml4KDAuNjM4NiAtMC43Njk2IDAuNzY5NiAwLjYzODYgLTMuMTk1MSAyNi41Mjc2KSIgY2xhc3M9InN0NSIgY3g9IjI2LjYiIGN5PSIxNi43IiByeD0iMC45IiByeT0iMC45Ii8+DQo8Zz4NCgk8cGF0aCBjbGFzcz0ic3Q2IiBkPSJNMjYuNiwxNy40Yy0wLjIsMC0wLjMtMC4xLTAuNS0wLjJjLTAuMy0wLjMtMC4zLTAuNy0wLjEtMWMwLjEtMC4yLDAuMy0wLjMsMC42LTAuM2MwLjIsMCwwLjMsMC4xLDAuNSwwLjINCgkJYzAuMywwLjMsMC4zLDAuNywwLjEsMUMyNy4xLDE3LjMsMjYuOSwxNy40LDI2LjYsMTcuNHoiLz4NCjwvZz4NCjxwYXRoIGNsYXNzPSJzdDUiIGQ9Ik0yOC4zLDE4LjVjMCwwLDYtMS45LDYuMS0yYzAuMy0wLjQsMC4zLTEtMC4xLTEuM2MtMC4yLTAuMi0wLjUtMC4yLTAuOC0wLjJsLTUuNywxLjdsMCwwLjINCgljLTAuMywwLjQtMC4zLDEsMC4xLDEuM2MwLjEsMC4xLDAuMiwwLjEsMC4zLDAuMkwyOC4zLDE4LjV6Ii8+DQo8ZWxsaXBzZSB0cmFuc2Zvcm09Im1hdHJpeCgwLjYzODYgLTAuNzY5NiAwLjc2OTYgMC42Mzg2IC0zLjQ0NTQgMjcuOTUyMykiIGNsYXNzPSJzdDUiIGN4PSIyOCIgY3k9IjE3LjYiIHJ4PSIwLjkiIHJ5PSIwLjkiLz4NCjxnPg0KCTxwYXRoIGNsYXNzPSJzdDYiIGQ9Ik0yOCwxOC40Yy0wLjIsMC0wLjMtMC4xLTAuNS0wLjJjLTAuMy0wLjMtMC4zLTAuNy0wLjEtMWMwLjEtMC4yLDAuMy0wLjMsMC42LTAuM2MwLjIsMCwwLjMsMC4xLDAuNSwwLjINCgkJYzAuMywwLjMsMC4zLDAuNywwLjEsMUMyOC40LDE4LjMsMjguMiwxOC40LDI4LDE4LjR6Ii8+DQo8L2c+DQo8cGF0aCBkPSJNMzUuMSwxNmMtMC4xLTAuMS0wLjItMC4yLTAuNC0wLjJsLTYsMS45Yy0wLjIsMC4xLTAuMywwLjItMC40LDAuNGwtMC4xLDAuMmMwLDAsMCwwLDAsMGwwLDAuM2MwLDAsMCwwLDAsMGwwLDAuN2w2LjgtMi4yDQoJTDM1LjEsMTZ6Ii8+DQo8cGF0aCBkPSJNMjguMywxNy45YzAtMC4yLTAuMi0wLjUtMC40LTAuN0wyMywxMy43Yy0wLjItMC4xLTAuNSwwLTAuNSwwLjJjMCwwLDAsMC40LDAsMC40bDAsMS4xbDUuOSw0LjJMMjguMywxNy45TDI4LjMsMTcuOXoiLz4NCjxnPg0KCTxwb2x5Z29uIGNsYXNzPSJzdDciIHBvaW50cz0iMjcuNywyMC43IDE3LjQsMjQgOSwxOCA5LjEsMTYuNSAyNy44LDE5LjMgCSIvPg0KCTxnPg0KCQk8cG9seWdvbiBjbGFzcz0ic3Q2IiBwb2ludHM9IjI3LjgsMTkuMyAxNy42LDIyLjUgOS4xLDE2LjUgMTkuMiwxMy4zIAkJIi8+DQoJPC9nPg0KCTxnPg0KCQk8cG9seWdvbiBjbGFzcz0ic3Q4IiBwb2ludHM9IjIxLDE4LjUgMTUuMywxNC41IDE5LjMsMTMuMyAyNSwxNy40IAkJIi8+DQoJCTxwYXRoIGNsYXNzPSJzdDkiIGQ9Ik0yMS41LDE3LjEiLz4NCgkJPHBvbHlnb24gY2xhc3M9InN0MTAiIHBvaW50cz0iMjAuOCwxNyAyMi4zLDE4LjEgMjMuNywxNy43IDIyLjIsMTYuNiAJCSIvPg0KCQk8cG9seWdvbiBjbGFzcz0ic3QxMSIgcG9pbnRzPSIyMy40LDE3LjMgMjIuNywxNi44IDIzLjUsMTYuNiAyNC4yLDE3LjEgCQkiLz4NCgkJPHBvbHlnb24gY2xhc3M9InN0MTEiIHBvaW50cz0iMjAuOCwxOCAyMC4xLDE3LjUgMjAuOSwxNy4zIDIxLjUsMTcuOCAJCSIvPg0KCQk8cG9seWdvbiBjbGFzcz0ic3QxMCIgcG9pbnRzPSIxOC42LDE2IDE2LjEsMTQuMyAxOC43LDEzLjUgMjEuMiwxNS4yIAkJIi8+DQoJPC9nPg0KPC9nPg0KPHBhdGggY2xhc3M9InN0MTIiIGQ9Ik02LjMsMjEuNiIvPg0KPGc+DQoJPHBvbHlnb24gY2xhc3M9InN0OCIgcG9pbnRzPSIxNy44LDIxLjEgMTcuNSwyMS4yIDE0LjksMTggMTUuMiwxNy45IDE3LjgsMTkuNyAJIi8+DQoJPHBvbHlnb24gY2xhc3M9InN0OCIgcG9pbnRzPSIxNy41LDIxLjIgMTQuOSwxOS40IDE0LjksMTggMTcuNSwxOS44IAkiLz4NCgk8cG9seWdvbiBjbGFzcz0ic3QxMyIgcG9pbnRzPSIxNy40LDE5LjYgMTUuNCwxOC4yIDE1LjQsMTcuNiAxNS44LDE3LjQgMTcuNSwxOC42IAkiLz4NCjwvZz4NCjxnPg0KCTxwb2x5Z29uIGNsYXNzPSJzdDgiIHBvaW50cz0iMTQsMTguNCAxMy43LDE4LjUgMTEuMiwxNS4zIDExLjUsMTUuMSAxNC4xLDE3IAkiLz4NCgk8cG9seWdvbiBjbGFzcz0ic3Q4IiBwb2ludHM9IjEzLjcsMTguNSAxMS4xLDE2LjcgMTEuMiwxNS4zIDEzLjgsMTcuMSAJIi8+DQoJPHBvbHlnb24gY2xhc3M9InN0MTMiIHBvaW50cz0iMTMuNywxNi45IDExLjcsMTUuNCAxMS43LDE0LjkgMTIsMTQuNyAxMy43LDE1LjkgCSIvPg0KPC9nPg0KPGc+DQoJPHBhdGggY2xhc3M9InN0MTQiIGQ9Ik0xNy4xLDE2Ljh2LTEuNmgtMS40djEuNmMwLDAsMCwwLDAsMGMwLDAuMiwwLjMsMC40LDAuNywwLjRDMTYuOCwxNy4zLDE3LjEsMTcuMSwxNy4xLDE2LjgNCgkJQzE3LjEsMTYuOSwxNy4xLDE2LjgsMTcuMSwxNi44eiIvPg0KCTxlbGxpcHNlIGN4PSIxNi40IiBjeT0iMTUuMiIgcng9IjAuNyIgcnk9IjAuNCIvPg0KPC9nPg0KPHBhdGggY2xhc3M9InN0MTUiIGQ9Ik0yMy45LDE2LjljMC00LjQtMC42LTguOS0zLjktOC45Yy0yLjMsMC0zLjIsMi0zLjIsN2MwLDAuMi0wLjIsMC40LTAuNCwwLjRTMTYsMTUuMiwxNiwxNC45DQoJYzAtNCwwLjUtNy43LDQtNy43YzQuMSwwLDQuNyw1LDQuNywxMGMwLDAuMSwwLDAuMSwwLDAuMkwyMy45LDE2Ljl6Ii8+DQo8Zz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTI3LjYsMjIuMmwtMy0yYy0xLTAuNy0yLjItMS4xLTMuNC0xLjFjLTMuNCwwLTYuMSwyLjctNi4xLDYuMWMwLDIsMSwzLjgsMi41LDQuOWwyLjksMi4xbDAuNy0wLjkNCgkJCWMzLjQsMCw2LjEtMi43LDYuMS02LjFjMC0wLjctMC4xLTEuNC0wLjQtMi4xTDI3LjYsMjIuMnoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0yNC4xLDIxLjFjLTMuNCwwLTYuMiwyLjgtNi4yLDYuMmMwLDMuNCwyLjgsNi4yLDYuMiw2LjJjMy40LDAsNi4yLTIuOCw2LjItNi4yQzMwLjMsMjMuOCwyNy41LDIxLjEsMjQuMSwyMS4xeiIvPg0KCTwvZz4NCgk8cGF0aCBjbGFzcz0ic3QxNiIgZD0iTTI3LjgsMjQuMWMtMC40LTAuNS0xLTAuOS0xLjYtMS4xYy0wLjYtMC4zLTEuMy0wLjQtMi0wLjRzLTEuMywwLjEtMiwwLjRjLTAuNiwwLjMtMS4xLDAuNy0xLjYsMS4xDQoJCWMtMC44LDAuOS0xLjIsMi0xLjIsMy4yYzAsMC4yLDAsMC4zLDAsMC41YzAuMSwwLjYsMC4zLDEuMywwLjYsMS44YzAuNywxLjIsMS44LDIsMy4yLDIuM2MwLjMsMC4xLDAuNiwwLjEsMSwwLjENCgkJYzAuMywwLDAuNiwwLDEtMC4xYzEuMy0wLjMsMi41LTEuMSwzLjItMi4zYzAuMy0wLjYsMC41LTEuMiwwLjYtMS44YzAtMC4yLDAtMC40LDAtMC41QzI5LjEsMjYuMSwyOC42LDI0LjksMjcuOCwyNC4xeiBNMjcsMjUuMQ0KCQljMC41LDAuNiwwLjgsMS40LDAuOCwyLjJjMCwwLjEsMCwwLjEsMCwwLjJjLTAuNSwwLTEtMC40LTEuMi0wLjlDMjYuNCwyNiwyNi42LDI1LjQsMjcsMjUuMXogTTIzLjQsMzAuNmMtMC44LTAuMi0xLjUtMC43LTItMS40DQoJCWMwLjItMC4xLDAuNS0wLjIsMC43LTAuMmMwLjMsMCwwLjUsMC4xLDAuOCwwLjNDMjMuMywyOS41LDIzLjUsMzAuMSwyMy40LDMwLjZ6IE0yNC4zLDI0LjljLTAuNSwwLTEtMC4zLTEuMi0wLjgNCgkJYzAuNC0wLjIsMC44LTAuMiwxLjItMC4yczAuOCwwLjEsMS4yLDAuMkMyNS4zLDI0LjUsMjQuOCwyNC45LDI0LjMsMjQuOXogTTIzLjYsMjcuNWMtMC4xLTAuMiwwLTAuNCwwLTAuNXMwLjItMC4zLDAuNC0wLjMNCgkJYzAuMSwwLDAuMSwwLDAuMiwwYzAuMywwLDAuNiwwLjIsMC43LDAuNWMwLjEsMC4yLDAsMC40LDAsMC41cy0wLjIsMC4zLTAuNCwwLjNjLTAuMSwwLTAuMSwwLTAuMiwwQzI0LDI4LDIzLjcsMjcuOCwyMy42LDI3LjV6DQoJCSBNMjUuNywyOS4yYzAuMi0wLjIsMC41LTAuMywwLjgtMC4zYzAuMywwLDAuNSwwLjEsMC43LDAuMmMtMC41LDAuNy0xLjIsMS4yLTIsMS40QzI1LjEsMzAuMSwyNS4zLDI5LjUsMjUuNywyOS4yeiBNMjIsMjYuNQ0KCQljLTAuMiwwLjUtMC42LDAuOS0xLjIsMC45YzAtMC4xLDAtMC4xLDAtMC4yYzAtMC44LDAuMy0xLjUsMC44LTIuMkMyMiwyNS40LDIyLjIsMjYsMjIsMjYuNXoiLz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE5LjMsMzFjLTAuNi0xLTEuMi0yLjQtMS4yLTMuNmMwLTMuNCwyLjctNi4yLDYuMi02LjJjMC44LDAsMS43LDAuMSwyLjQsMC40bC0wLjItMC4xDQoJCQljLTAuNy0wLjMtMS42LTAuNS0yLjQtMC41Yy0zLjQsMC02LjIsMi44LTYuMiw2LjJjMCwxLjMsMC41LDIuNiwxLjEsMy42TDE5LjMsMzF6Ii8+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yNi41LDIxLjUiLz4NCgk8L2c+DQo8L2c+DQo8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTcuOSwyOS41Yy00LjEsMS4zLTguOS0wLjgtMTMuMS00LjFjLTQuMy0zLjMtNC4zLTguMi0zLThsMTYsMTAuN0wxNy45LDI5LjV6Ii8+DQo8cGF0aCBjbGFzcz0ic3QzIiBkPSJNMTcuOSwyOC4xQzEzLjgsMjkuNCw5LDI3LjMsNC44LDI0Yy00LjMtMy4zLTQuMy03LjMtMi45LTcuMkwxNy45LDI4LjF6Ii8+DQo8cGF0aCBjbGFzcz0ic3QxNyIgZD0iTTE4LDI4LjMiLz4NCjxwb2x5Z29uIGNsYXNzPSJzdDgiIHBvaW50cz0iMTAuNiwxOSA1LjEsMTUuMSA0LjksMjEuMiAxMC4zLDI1LjMgIi8+DQo8cG9seWdvbiBjbGFzcz0ic3QzIiBwb2ludHM9IjUuNywyMC44IDUuOSwxNy4yIDkuMywxOS42IDkuMiwyMy4yICIvPg0KPHBvbHlnb24gY2xhc3M9InN0MTgiIHBvaW50cz0iNi40LDIwLjUgNi40LDE4LjMgOC43LDE5LjkgOC42LDIyLjEgIi8+DQo8cG9seWdvbiBjbGFzcz0ic3Q4IiBwb2ludHM9IjEzLjEsMjUgMy4yLDE4IDMuNCwxMS40IDEzLjMsMTguNCAiLz4NCjxwb2x5Z29uIGNsYXNzPSJzdDE5IiBwb2ludHM9IjEyLjIsMjMuNiAzLjgsMTcuNyA0LDEyLjcgMTIuNCwxOC42ICIvPg0KPHBhdGggY2xhc3M9InN0MjAiIGQ9Ik04LjUsMjNjMCwwLDIuNS0xLjEsMi43LTEuNWMwLjctMS4xLDAuNS0yLjUtMC42LTMuM2MtMC42LTAuNC0xLjQtMC41LTItMC4zbC0xLjcsMC42TDcuMSwxOQ0KCWMtMC43LDEuMS0wLjUsMi41LDAuNiwzLjJjMC4yLDAuMiwwLjUsMC4zLDAuNywwLjNMOC41LDIzeiIvPg0KPHBhdGggY2xhc3M9InN0MTciIGQ9Ik03LDIxLjZjMC4yLDAuMywwLjQsMC41LDAuNiwwLjdjMC4yLDAuMiwwLjUsMC4zLDAuNywwLjNMOC41LDIzYzAsMCwyLjUtMS4xLDIuNy0xLjVjMC40LTAuNiwwLjUtMS4zLDAuMy0yDQoJTDcsMjEuNnoiLz4NCjxlbGxpcHNlIGNsYXNzPSJzdDIwIiBjeD0iNy43IiBjeT0iMjAuOCIgcng9IjIuMyIgcnk9IjIuMyIvPg0KPHBhdGggY2xhc3M9InN0MjEiIGQ9Ik03LjYsMjIuOGMtMC40LDAtMC44LTAuMS0xLjEtMC40Yy0wLjktMC42LTEuMS0xLjktMC41LTIuN2MwLjQtMC41LDAuOS0wLjgsMS42LTAuOGMwLjQsMCwwLjgsMC4xLDEuMSwwLjQNCgljMC45LDAuNiwxLjEsMS45LDAuNSwyLjdDOC44LDIyLjQsOC4yLDIyLjgsNy42LDIyLjh6Ii8+DQo8cGF0aCBjbGFzcz0ic3QxMSIgZD0iTTYuMywyMS40Yy0wLjMtMC44LDAtMS43LDAuNy0yYzAuNC0wLjIsMC45LTAuMiwxLjQsMC4xYzAuMywwLjIsMC41LDAuNCwwLjYsMC43TDYuMywyMS40eiIvPg0KPHBhdGggY2xhc3M9InN0MjAiIGQ9Ik0zLjgsMTkuN2MwLDAsMi41LTEuMSwyLjctMS41QzcuMiwxNy4yLDcsMTUuOCw2LDE1Yy0wLjYtMC40LTEuNC0wLjUtMi0wLjNsLTEuNywwLjZsMC4xLDAuNA0KCWMtMC43LDEuMS0wLjUsMi41LDAuNiwzLjJjMC4yLDAuMiwwLjUsMC4zLDAuNywwLjNMMy44LDE5Ljd6Ii8+DQo8cGF0aCBjbGFzcz0ic3QxNyIgZD0iTTIuMywxOC4zYzAuMiwwLjMsMC40LDAuNSwwLjYsMC43YzAuMiwwLjIsMC41LDAuMywwLjcsMC4zbDAuMSwwLjRjMCwwLDIuNS0xLjEsMi43LTEuNQ0KCWMwLjQtMC42LDAuNS0xLjMsMC4zLTJMMi4zLDE4LjN6Ii8+DQo8ZWxsaXBzZSBjbGFzcz0ic3QyMCIgY3g9IjMiIGN5PSIxNy41IiByeD0iMi4zIiByeT0iMi4zIi8+DQo8cGF0aCBjbGFzcz0ic3QyMSIgZD0iTTIuOSwxOS41Yy0wLjQsMC0wLjgtMC4xLTEuMS0wLjRjLTAuOS0wLjYtMS4xLTEuOS0wLjUtMi43YzAuNC0wLjUsMC45LTAuOCwxLjYtMC44YzAuNCwwLDAuOCwwLjEsMS4xLDAuNA0KCWMwLjksMC42LDEuMSwxLjksMC41LDIuN0M0LjEsMTkuMiwzLjUsMTkuNSwyLjksMTkuNXoiLz4NCjxwYXRoIGNsYXNzPSJzdDExIiBkPSJNMS42LDE4LjJjLTAuMy0wLjgsMC0xLjcsMC43LTJDMi43LDE2LDMuMiwxNiwzLjYsMTYuMmMwLjMsMC4yLDAuNSwwLjQsMC42LDAuN0wxLjYsMTguMnoiLz4NCjwvc3ZnPg0K';

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = menuIconURI;

/**
 * How long to wait in ms before timing out requests to IoT Terminal.
 * @type {int}
 */
const serverTimeoutMs = 5000; // 5 seconds (chosen arbitrarily).

const LED_ARR = ['ON', 'OFF'];
const SENSOR_ANGLE_ARR = ['0', '45', '90', '135', '180']; // String型
const GO_BACK__ARR = ['GO', 'STOP', 'BACK', 'BACKTURN'];
const TURN_ARR = ['RIGHT', 'LEFT'];
/**
 * Class for the iotcar2wd blocks.
 * @constructor
 */
class Scratch3IotCar2wdBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        /**
         * The most recently received value for each sensor.
         */
        this._sensors = {
            distance: -99,
            rightir: '無し',
            leftir: '無し'
        };
        this._iotCar2wdIp = '192.168.x.x';
        this._iotCar2wdStatus = '-';
        this._iotCarAdjustAngle = 0;
        this._iotCarAdjustBalance = 0;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'iotcar2wd',
            name: 'sLab-Car',
            blockIconURI: blockIconURI,
            menuIconURI: menuIconURI,
            blocks: [
                {
                    opcode: 'setIotIp',
                    text: formatMessage({
                        id: 'iotcar2wd.setIotIpBlock',
                        default: 'Car IPアドレス [IPADDR]',
                        description: 'set IoT Car2wd IP.'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        IPADDR: {
                            type: ArgumentType.STRING,
                            defaultValue: this._iotCar2wdIp
                        }
                    }
                },
                {
                    opcode: 'adjustAngle',
                    text: formatMessage({
                        id: 'iotcar2wd.adjustAngle',
                        default: '距離センサ角度補正 [ADJUST_ANG]',
                        description: 'adjust Sensor Angle.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ADJUST_ANG: {
                            type: ArgumentType.STRING,
                            defaultValue: this._iotCarAdjustAngle
                        }
                    }
                },
                /* {
                    opcode: 'adjustBalance',
                    text: formatMessage({
                        id: 'iotcar2wd.adjustBalance',
                        default: '左右タイヤ補正 [ADJUST_BLC]',
                        description: 'adjust Wheel Balance.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ADJUST_BLC: {
                            type: ArgumentType.STRING,
                            defaultValue: this._iotCarAdjustBalance
                        }
                    }
                },*/
                '---',
                {
                    opcode: 'ledControl',
                    text: formatMessage({
                        id: 'iotremocon.ledControl',
                        default: 'LED制御 [LED_CONT]',
                        description: 'LED Control'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        LED_CONT: {
                            type: ArgumentType.STRING,
                            menu: 'led_cont',
                            defaultValue: 'ON'
                        }
                    }
                },
                {
                    opcode: 'sensorDistanceUpdate',
                    text: formatMessage({
                        id: 'iotcar2wd.updateSensorData',
                        default: '距離測定',
                        description: 'Update Distance Sensor Data'
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'sensorAngleControl',
                    text: formatMessage({
                        id: 'iotcar2wd.sensorControl',
                        default: '距離センサ回転 [SENSOR_ANGLE]',
                        description: 'sensor Control Signal'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SENSOR_ANGLE: {
                            type: ArgumentType.STRING,
                            menu: 'sensor_angles',
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: 'carGobackControl',
                    text: formatMessage({
                        id: 'iotcar2wd.carGobackControl',
                        default: 'Car GO/BACK [GO_BACK]',
                        description: 'car GO/BACK Control Signal'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        GO_BACK: {
                            type: ArgumentType.STRING,
                            menu: 'gobacks',
                            defaultValue: 'GO'
                        }
                    }
                },
                {
                    opcode: 'carTurnControl',
                    text: formatMessage({
                        id: 'iotcar2wd.carTurnControl',
                        default: 'Car 回転 [TURN_DIR] [TURN_TIME]msec',
                        description: 'car Turn Control Signal'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TURN_DIR: {
                            type: ArgumentType.STRING,
                            menu: 'turns',
                            defaultValue: 'RIGHT'
                        },
                        TURN_TIME: {
                            type: ArgumentType.STRING,
                            defaultValue: 300
                        }
                    }
                },
                '---',
                {
                    opcode: 'getViewerCar2wdIp',
                    text: formatMessage({
                        id: 'iotcar2wd.viewerCar2wdIp',
                        default: 'Car IPアドレス',
                        description: 'IoT Car 2WD IP of the project viewer'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {}
                },
                {
                    opcode: 'getViewerCar2wdStatus',
                    text: formatMessage({
                        id: 'iotcar2wd.viewerCar2wdStatus',
                        default: 'Car Status',
                        description: 'IoT Car 2WD Status of the project viewer'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {}
                },
                {
                    opcode: 'getViewerDistance',
                    text: formatMessage({
                        id: 'iotcar2wd.viewerDistance',
                        default: '距離(cm)',
                        description: 'Distance of the project viewer'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {}
                },
                {
                    opcode: 'getViewerAdjustAngle',
                    text: formatMessage({
                        id: 'iotcar2wd.viewerAdjustAngle',
                        default: '角度補正',
                        description: 'AdjustAngle of the project viewer'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {}
                }, 
                {
                    opcode: 'getViewerRightIr',
                    text: formatMessage({
                        id: 'iotcar2wd.viewerRightIr',
                        default: '右Irセンサー',
                        description: 'Right Ir Sensor of the project viewer'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {}
                }, 
                {
                    opcode: 'getViewerLeftIr',
                    text: formatMessage({
                        id: 'iotcar2wd.viewerLeftIr',
                        default: '左Irセンサー',
                        description: 'Left Ir Sensor of the project viewer'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {}
                }/* ,
                {
                    opcode: 'getViewerAdjustBalance',
                    text: formatMessage({
                        id: 'iotcar2wd.viewerAdjustBalance',
                        default: '左右タイヤ補正',
                        description: 'AdjustBalance of the project viewer'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {}
                }*/
            ],
            menus: {
                led_cont: {
                    acceptReporters: true,
                    items: LED_ARR
                },
                sensor_angles: {
                    acceptReporters: true,
                    items: SENSOR_ANGLE_ARR
                },
                gobacks: {
                    acceptReporters: true,
                    items: GO_BACK__ARR
                },
                turns: {
                    acceptReporters: true,
                    items: TURN_ARR
                }
            }
        };
    }
    
    setIotIp (args) {
        this._iotCar2wdIp = Cast.toString(args.IPADDR);
        log.log(this._iotCar2wdIp);
    }

    getViewerCar2wdIp () {
        return this._iotCar2wdIp;
    }

    getViewerCar2wdStatus () {
        return this._iotCar2wdStatus;
    }

    getViewerDistance () {
        return this._sensors.distance;
    }

    getViewerRightIr () {
        return this._sensors.rightir;
    }

    getViewerLeftIr () {
        return this._sensors.leftir;
    }

    getViewerAdjustAngle () {
        return this._iotCarAdjustAngle;
    }

    /* getViewerAdjustBalance () {
        return this._iotCarAdjustBalance;
    }*/

    ledControl (args) {
        const urlBase = `http://${this._iotCar2wdIp}/led?o=${args.LED_CONT}`;
        log.log(`IrSend:${urlBase}`);
        this.controlIot(1, urlBase, serverTimeoutMs);
        this._iotRemoconStatus = 'LED Controling...';
    }

    sensorAngleControl (args) {
        const urlBase = `http://${this._iotCar2wdIp}/s_angle?n=${args.SENSOR_ANGLE}`;
        log.log(`sensorControl:${urlBase}`);
        this.controlIot(2, urlBase, serverTimeoutMs);
        this._iotCar2wdStatus = 'Receiving...';
    }

    sensorDistanceUpdate () {
        const urlBase = `http://${this._iotCar2wdIp}/update_d`;
        log.log(`sensorControl:${urlBase}`);
        this.controlIot(3, urlBase, serverTimeoutMs);
        this._iotCar2wdStatus = 'Receiving...';
    }

    carGobackControl (args) {
        const urlBase = `http://${this._iotCar2wdIp}/cargo?a=${args.GO_BACK}`;
        log.log(`carControl:${urlBase}`);
        this.controlIot(4, urlBase, serverTimeoutMs);
        this._iotCar2wdStatus = 'Sending...';
    }

    carTurnControl (args) {
        const urlBase = `http://${this._iotCar2wdIp}/carturn?a=${args.TURN_DIR}&n=${args.TURN_TIME}`;
        log.log(`carControl:${urlBase}`);
        this.controlIot(5, urlBase, serverTimeoutMs);
        this._iotCar2wdStatus = 'Sending...';
    }
    
    adjustAngle (args) {
        const urlBase = `http://${this._iotCar2wdIp}/adjusta?n=${args.ADJUST_ANG}`;
        log.log(`carControl:${urlBase}`);
        this.controlIot(6, urlBase, serverTimeoutMs);
        this._iotCar2wdStatus = 'Adjusting...';
        this._iotCarAdjustAngle = Cast.toNumber(args.ADJUST_ANG);
    }

    /* adjustBalance (args) {
        const urlBase = `http://${this._iotCar2wdIp}/adjustb?n=${args.ADJUST_BLC}`;
        log.log(`carControl:${urlBase}`);
        this.controlIot(7, urlBase, serverTimeoutMs);
        this._iotCar2wdStatus = 'Adjusting...';
        this._iotCarAdjustBalance = Cast.toNumber(args.ADJUST_BLC);
    }*/

    controlIot (jobType, urlBase, serverTimeoutMsSet) {
        const updatePromise = new Promise(resolve => {
            nets({
                url: urlBase,
                timeout: serverTimeoutMsSet
            }, (err, res, body) => {
                if (err) {
                    this._iotCar2wdStatus = 'Failed';
                    log.log(`error sensor update! ${err}/${res}`);
                    this.resetSensor();
                    resolve('');
                    return '';
                }
                if (jobType === 3) {
                    const getSensor = JSON.parse(body);
                    const getDistance = Cast.toNumber(getSensor.d);
                    if (getDistance >= 0) {
                        this._sensors.distance = getDistance;
                        if(getSensor.r == 'L'){
                            this._sensors.rightir = '検出';
                        } else {
                            this._sensors.rightir = '無し';
                        }
                        if(getSensor.l == 'L'){
                            this._sensors.leftir = '検出';
                        } else {
                            this._sensors.leftir = '無し';
                        }
                        this._iotCar2wdStatus = 'Completed';
                    } else {
                        this.resetSensor();
                        this._iotCar2wdStatus = 'Failed';
                    }
                } else if (body.indexOf('OK') === -1) {
                    this._iotCar2wdStatus = 'Failed';
                } else {
                    this._iotCar2wdStatus = 'Completed';
                }
                resolve(body);
                return body;
            });
        });
        updatePromise.then(result => result);
        return updatePromise;
    }

    resetSensor () {
        this._sensors = {
            distance: -99,
            rightir: '無し',
            leftir: '無し'
        };
        return;
    }

}
module.exports = Scratch3IotCar2wdBlocks;
