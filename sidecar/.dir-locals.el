((typescript-mode . ((flycheck-checker . javascript-eslint)
                     (eval . (flycheck-add-next-checker 'javascript-eslint 'typescript-tide))
                     )))
